use crate::db_utils::DbActor;
use crate::messages::{MGetUser, MPostUser, MPutUser};
use crate::models::{newUser, updateUser};
use crate::utils::hashing;
use crate::{
    db_models::User,
    schema::user::dsl::*,
    messages::{MGetUsers},
};
use actix::Handler;
use diesel::{self,prelude::*};

impl Handler<MGetUsers> for DbActor {
    type Result = QueryResult<Vec<User>>;
    
    fn handle(&mut self, _msg: MGetUsers, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        user.get_results::<User>(&mut conn)
    }

}

impl Handler<MPostUser> for DbActor {
    type Result = QueryResult<User>;
    
    fn handle(&mut self, msg: MPostUser, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        
        let new_user = newUser {
            username: msg.username.clone(),
            email: msg.email.clone(),
            password: msg.password.clone()
        };

        diesel::insert_into(user).values(&new_user).get_result(&mut conn)
    }
}

impl Handler<MGetUser> for DbActor {
    type Result = QueryResult<User>;
    
    fn handle(&mut self, msg: MGetUser, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        user.find(msg.id).get_result(&mut conn)
    }
}

impl Handler<MPutUser> for DbActor {
    type Result = QueryResult<User>;
    
    fn handle(&mut self, msg: MPutUser, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");

        diesel::update(user.find(msg.id))
            .set(&msg.update_user)
            .get_result(&mut conn)
    }
}