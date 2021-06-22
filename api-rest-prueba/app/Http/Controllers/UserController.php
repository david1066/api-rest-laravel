<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\User;

class UserController extends Controller
{

    public function index(Request $request)
    {
        //conseguir usuario identificado
        $user = $this->getIdentity($request);
        $users = new User();

        if ($user->role == 'admin') {
            $users = $users::Where('id','!=',$user->sub)->get();
        } else if ($user->role == 'seller') {
            $users = $users::where('role', 'client')->Where('id','!=',$user->sub)->get();
        }



        return response()->json(['code' => 200, 'status' => 'success', 'users' => $users], 200);
    }


    public function detail(Request $request,$id)
    {
        //conseguir usuario identificado
        $user = $this->getIdentity($request);
        $users = new User();

        if ($user->role == 'admin') {
            $users = $users::Where('id',$id)->first();
        } else if ($user->role == 'seller') {
            $users = $users::where('id',$id)->where('role', 'client')->first();
        }



        return response()->json(['code' => 200, 'status' => 'success', 'user' => $users], 200);
    }
    public function create(Request $request)
    {
        //recoger los datos del usuario por post
        $json = $request->input('json', null);
        $params = json_decode($json); //objeto
        $params_array = json_decode($json, true); //array
        //var_dump($params_array);


        //limpiar datos
        if (!empty($params) && !empty($params_array)) {
            $params_array = array_map('trim', $params_array);


            //validar datos
            $validate = \Validator::make(
                $params_array,
                [
                    'name' => 'required|alpha', 'surname' => 'required|alpha',
                    'email' => 'required|email|unique:users', //comprobar si el usuario existe ya(duplicado)
                    'role' => 'required|alpha',
                    'address' => 'required',
                    'typedocument' => 'required',
                    'document' => 'required|integer'
                ]
            );
            if ($validate->fails()) {

                $data = array(
                    'status' => 'error',
                    'code' => 404,
                    'message' => 'El usuario no se ha creado',
                    'errors' => $validate->errors()
                );
            } else {

                //cifrar la contraseña
                $pwd = hash('sha256', $params->password);
                if( $params_array['role']=='client'){
                    $pwd = hash('sha256', 'client');
                }
                
                //crear el usuario
                $user = new User();
                $user->name = $params_array['name'];
                $user->surname = $params_array['surname'];
                $user->email = $params_array['email'];
                $user->password = $pwd;
                $user->role =  $params_array['role'];
                $user->address = $params_array['address'];
                $user->typedocument = $params_array['typedocument'];
                $user->document = $params_array['document'];
                //guarda el usuario en BD
                $user->save();

                $data = array(
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El usuario se ha creado correctamente',
                    'user' => $user
                );
            }
        } else {
            $data = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'Los datos enviados no son correctos'
            );
        }



        return response()->json($data, $data['code']);
    }

    


    

    public function login(Request $request)
    {
        $jwtAuth = new \JwtAuth();
        //recibir datos por post
        $json = $request->input('json', null);
        $params = json_decode($json);
        $params_array = json_decode($json, true);
        //validar esos datos
        $validate = \Validator::make(
            $params_array,
            [
                'email' => 'required|email', //comprobar si el usuario existe ya(duplicado)
                'password' => 'required'
            ]
        );


        if ($validate->fails()) {

            $signup = array(
                'status' => 'error',
                'code' => 404,
                'message' => 'El usuario no se ha podido loguear',
                'errors' => $validate->errors()
            );
        } else {
            //cifrar la password

            $pwd = hash('sha256', $params->password);
            // devolver token o datos
            $signup = $jwtAuth->signup($params->email, $pwd);
            if (!empty($params->getToken)) {
                $signup = $jwtAuth->signup($params->email, $pwd, true);
            }
        }

        return  response()->json($signup, 200);
    }

    public function update($id, Request $request)
    {
        //comprobar si el usuario esta identificado
        $token = $request->header('Authorization');
        $jwtAuth = new \JwtAuth();
        $checkToken = $jwtAuth->checkToken($token);
        //recoger los datos por post
        $json = $request->input('json', null);
        $params_array = json_decode($json, true);
        if ($checkToken && !empty($params_array)) {

            //sacar usuario identificado
            $user = $jwtAuth->checkToken($token, true);

            $user2 = User::where('id', $id)->first();


            $canUpdate = $this->canPermiss($user, $user2);

            if ($canUpdate) {

                $validate = \Validator::make(
                    $params_array,
                    [
                        'name' => 'required|alpha',
                        'surname' => 'required|alpha',
                        'email' => 'required|email|unique:users,' . $user->sub, //comprobar si el usuario existe ya(duplicado)
                        'role' => 'required|alpha',
                        'address' => 'required',
                        'typedocument' => 'required',
                        'document' => 'required|integer'
                    ]
                );
                // quitar los campos que no quiero actualizar
                unset($params_array['id']);
     
                unset($params_array['created_at']);
                unset($params_array['remember_token']);
               
                if($params_array['role']=='client'){
                    $pwd = hash('sha256', 'client');
                }else{
                    $pwd = hash('sha256', $params_array['password']);
                }

                
                $params_array['password'] = $pwd;
                //actualizar usuario db
                $user_update = User::where('id', $id)->update($params_array);
                //devolver array con resultado
                $data = array(
                    'code' => 200,
                    'status' => 'success',
                    'user' => $user_update,
                    'changes' => $params_array
                );
            } else {
                $data = array(
                    'code' => 400,
                    'status' => 'error',
                    'message' => 'El usuario no tiene los permisos para realizar esta accion'
                );
            }
        } else {

            $data = array(
                'code' => 400,
                'status' => 'error',
                'message' => 'El usuario no esta identificado.'
            );
        }


        return response()->json($data, $data['code']);
    }

    public function delete($iduser, Request $request)
    {
        //conseguir usuario identificado
        $user = $this->getIdentity($request);
        //comprobar si existe el registro
        $user2 = User::where('id', $iduser)->first();
        $canUpdate = $this->canPermiss($user, $user2);

        if ($canUpdate) {
            $user = User::where('id', $iduser)->first();


            if (!empty($user)) {

                //borrarlo
                $user->delete();
                //devolver algo
                $data = [
                    'code' => 200,
                    'status' => 'success', 'user' => $user
                ];
            } else {
                $data = [
                    'code' => 404,
                    'status' => 'error', 'message' => 'el user no existe'
                ];
            }
        }else{
            $data = [
                'code' => 400,
                'status' => 'error', 'message' => 'El usuario no tiene permisos para eliminar este usuario'
            ];
        }
        return response()->json($data, $data['code']);
    }

    public function search($search,Request $request){

        $user = $this->getIdentity($request);

        $users= User::Where('email', 'like', '%' . $search . '%')->
       orWhere('name', 'like', '%' . $search . '%')->
       orWhere('surname', 'like', '%' . $search . '%')->
       orWhere('document', 'like', '%' . $search . '%')->
       orWhere('role', 'like', '%' . $search . '%')->
       orWhere('typedocument', 'like', '%' . $search . '%')->get();
      
       /* $array =json_decode($users,true);
        if($user->role=='seller'){
            for ($i=0; $i<count($array); $i++){
                if($array[$i]['role']<>'client'){
                      unset($array[$i]);  
                }
            } 
           
    
        }
         */
       $data = [
        'code' => 200,
        'status' => 'success', 'search' =>  $users
    ];
    return response()->json($data, $data['code']);
    }

    private function getIdentity($request)
    {
        $jwtAuth = new \JwtAuth();
        $token = $request->header('Authorization', null);
        $user = $jwtAuth->checktoken($token, true);
        return $user;
    }

    private function canPermiss($user, $user2)
    {
        $canUpdate = false;
        if ($user->role == 'admin') {
            $canUpdate = true;
        }
        if ($user->role == 'seller' && $user2['role'] == 'client') {
            $canUpdate = true;
        }
        return $canUpdate;
    }

 
}
