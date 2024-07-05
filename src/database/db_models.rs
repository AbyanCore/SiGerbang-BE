#![allow(unused)]
#![allow(clippy::all)]

use chrono::NaiveDateTime;
use diesel::{ Queryable };
use serde::Serialize;

#[derive(Queryable, Debug, Serialize)]
#[diesel(primary_key(uuid))]
pub struct Grub {
    pub uuid: String,
    pub name: String,
    pub author: i32,
    pub description: String,
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
}

#[derive(Queryable, Debug, Serialize)]
pub struct GrubUser {
    pub id: i32,
    pub grub_id: String,
    pub user_id: i32,
    pub user_role: String,
    pub created_at: NaiveDateTime,
}

#[derive(Queryable, Debug, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password: String,
    pub email: String,
    pub created_at: NaiveDateTime,
    pub updated_at: Option<NaiveDateTime>,
}
