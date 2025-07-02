<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Membuat instance dari UserController untuk memanggil fungsinya.
     */
    protected $userController;

    public function __construct(UserController $userController)
    {
        $this->userController = $userController;
    }

    /**
     * Update detail profil user yang sedang login.
     * Fungsi ini sekarang hanya memvalidasi dan meneruskan ke UserController.
     */
    public function updateDetails(Request $request)
    {
        $user = $request->user();
        // Teruskan request ke UserController@update
        return $this->userController->update($request, $user);
    }

    /**
     * Update foto profil user yang sedang login.
     * Fungsi ini sekarang hanya memvalidasi dan meneruskan ke UserController.
     */
    public function updatePhoto(Request $request)
    {
        $user = $request->user();
        // Teruskan request ke UserController@update
        return $this->userController->update($request, $user);
    }

    /**
     * Hapus foto profil user yang sedang login.
     */
    public function deletePhoto(Request $request)
    {
        $user = $request->user();
        // Kita bisa buat request baru untuk memastikan hanya 'delete_photo' yang di-set
        $deleteRequest = new Request();
        $deleteRequest->merge(['delete_photo' => true]);
        
        // Teruskan request ke UserController@update
        return $this->userController->update($deleteRequest, $user);
    }
}