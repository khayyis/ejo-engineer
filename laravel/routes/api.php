<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\EjoController;

// Auth
Route::post('/login', [EjoController::class, 'login']);
Route::post('/heartbeat', [EjoController::class, 'heartbeat']);
Route::post('/logout', [EjoController::class, 'logout']);

// EJO
Route::get('/ejos', [EjoController::class, 'getEjos']);
Route::post('/ejos', [EjoController::class, 'createEjo']);
Route::put('/ejos/{id}', [EjoController::class, 'updateEjo']);
Route::delete('/ejos/{id}', [EjoController::class, 'deleteEjo']);

// General EJO
Route::get('/general-ejos', [EjoController::class, 'getGeneralEjos']);
Route::post('/general-ejos', [EjoController::class, 'createGeneralEjo']);
Route::put('/general-ejos/{id}', [EjoController::class, 'updateGeneralEjo']);
Route::delete('/general-ejos/{id}', [EjoController::class, 'deleteGeneralEjo']);

// Drawings
Route::get('/drawings', [EjoController::class, 'getDrawings']);
Route::post('/drawings', [EjoController::class, 'uploadDrawing']);
Route::put('/drawings/{id}', [EjoController::class, 'updateDrawing']);
Route::delete('/drawings/{id}', [EjoController::class, 'deleteDrawing']);

// Projects
Route::get('/projects', [EjoController::class, 'getProjects']);
Route::post('/projects', [EjoController::class, 'createProject']);
Route::put('/projects/{id}', [EjoController::class, 'updateProject']);
Route::delete('/projects/{id}', [EjoController::class, 'deleteProject']);
Route::post('/projects/upload-doc', [EjoController::class, 'uploadProjectDoc']);

// Repair Parts
Route::get('/repair-parts', [EjoController::class, 'getRepairParts']);
Route::post('/repair-parts', [EjoController::class, 'createRepairPart']);
Route::delete('/repair-parts/{id}', [EjoController::class, 'deleteRepairPart']);

// Users
Route::get('/users', [EjoController::class, 'getUsers']);
Route::post('/users', [EjoController::class, 'createUser']);
Route::put('/users/{username}', [EjoController::class, 'updateUser']);
Route::put('/users/{username}/layout-settings', [EjoController::class, 'updateUserLayoutSettings']);
Route::delete('/users/{username}', [EjoController::class, 'deleteUser']);
Route::post('/upload-avatar', [EjoController::class, 'uploadAvatar']);

// Settings
Route::get('/settings', [EjoController::class, 'getSettings']);
Route::put('/settings', [EjoController::class, 'updateSettings']);

// Notifications
Route::get('/notifications', [EjoController::class, 'getNotifications']);
Route::put('/notifications/read-all', [EjoController::class, 'markAllNotificationsRead']);
Route::delete('/notifications', [EjoController::class, 'deleteNotifications']);

// File Upload
Route::post('/upload', [EjoController::class, 'uploadFile']);


// Nuclear & Modular Database Reset
Route::post('/nuclear', [EjoController::class, 'nuclearDatabase']);
Route::post('/database/reset-module', [EjoController::class, 'resetModuleDatabase']);
