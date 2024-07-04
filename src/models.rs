use diesel::{AsChangeset, Insertable};
use serde::{Deserialize, Serialize};

use crate::schema::user;

#[derive(Debug,Deserialize,Serialize)]
pub struct ResponeMessage<T>{
    pub data: T,
    pub message: String,
    pub status: i32
}

// Insertable
#[derive(Debug,Serialize,Insertable,Clone)]
#[diesel(table_name=user)]
pub struct newUser {
    pub username: String,
    pub email: String,
    pub password: String,
}

// Updatable
#[derive(Debug,Deserialize,AsChangeset)]
#[diesel(table_name=user)]
pub struct updateUser {
    pub username: Option<String>,
    pub email: Option<String>,
    pub password: Option<String>,
}