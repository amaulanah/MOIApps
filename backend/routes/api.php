<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UserLevelController;
use App\Http\Controllers\Api\ProfileController; // <-- Pastikan ini di-import

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Rute Publik (Login)
Route::post('/login', [AuthController::class, 'login']);

// Rute Terproteksi (Butuh Login)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']); // Mendapatkan data user yg login

    // Rute untuk Account Control (Hanya Admin & Director)
    Route::middleware('can:access-account-control')->group(function () {
        Route::apiResource('/users', UserController::class);
        Route::apiResource('/user-levels', UserLevelController::class);
    });
    
    // ==========================================================
    // PERBAIKAN: RUTE LENGKAP UNTUK USER PROFILE
    // ==========================================================
    // Route::get('/profile/getProfile', [ProfileController::class, 'getProfile']);
    // Route::post('/profile/updateAuthDetails', [ProfileController::class, 'updateAuthDetails']);
    // Route::post('/profile/updateProfileDetails', [ProfileController::class, 'updateProfileDetails']);
    // Route::post('/profile/photo', [ProfileController::class, 'updatePhoto']);
    // Route::post('/profile/deleteFile', [ProfileController::class, 'deleteFile']);
    Route::post('/profile/details', [ProfileController::class, 'updateDetails']);
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto']);
});