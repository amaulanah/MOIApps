<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Controller ini sekarang hanya bertindak sebagai 'pintu masuk'
     * dan akan meneruskan semua request ke UserController yang sudah benar.
     */
    public function updateDetails(Request $request)
    {
        // Panggil method 'update' dari UserController,
        // dengan request yang sama dan user yang sedang login.
        return app(UserController::class)->update($request, $request->user());
    }
}