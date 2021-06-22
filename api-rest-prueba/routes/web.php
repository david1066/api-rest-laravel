<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//cargando clases
use App\Http\Middleware\ApiAuthMiddleware;


Route::get('/', function () {
    return view('welcome');
});



Route::post('/api/create','UserController@create');
Route::post('/api/login','UserController@login');
Route::get('/api/users','UserController@index')->middleware(ApiAuthMiddleware::class);
Route::get('/api/user/{id}','UserController@detail')->middleware(ApiAuthMiddleware::class);
Route::put('/api/user/update/{id}','UserController@update')->middleware(ApiAuthMiddleware::class);
Route::delete('/api/user/delete/{id}','UserController@delete')->middleware(ApiAuthMiddleware::class);
Route::get('/api/user/search/{search}','UserController@search')->middleware(ApiAuthMiddleware::class);
