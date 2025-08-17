"use strict";

//check if the user is authenticated
if(!localStorage.getItem("admin-token")) {
    window.location.href = "index.html";
}