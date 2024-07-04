use crate::{db_models::{Grub,GrubUser,User}, models::updateUser};
use actix::Message;
use diesel::{query_builder::AsChangeset, QueryResult, QuerySource};
use serde::Deserialize;

#[derive(Message)]
#[rtype(result = "QueryResult<Vec<User>>")]
pub struct MGetUsers;

#[derive(Message,Deserialize)]
#[rtype(result = "QueryResult<User>")]
pub struct MPostUser {
    pub username: String,
    pub email: String,
    pub password: String
}

#[derive(Message)]
#[rtype(result = "QueryResult<User>")]
pub struct MGetUser {
    pub id: i32
}

#[derive(Message,Deserialize)]
#[rtype(result = "QueryResult<User>")]
pub struct MPutUser {
    pub id: i32,
    pub update_user: updateUser
}