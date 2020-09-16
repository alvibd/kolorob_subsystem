<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('api')->group(function(){
    Route::post('login', 'AuthController@login');
    Route::post('refresh', 'AuthController@refresh');
    Route::get('contents', 'PostController@index');
});

Route::middleware('auth:api')->group(function(){
    Route::post('me', 'AuthController@me');
    Route::post('logout', 'AuthController@logout');
    // Route::post('refresh', 'AuthController@refresh');
});

Route::middleware(['auth:api', 'role:superadministrator|administrator'])->group(function(){
    Route::post('create_post', 'PostController@store');
    Route::post('create_post/{post}/upload', 'PostController@uploadMedia');
});
