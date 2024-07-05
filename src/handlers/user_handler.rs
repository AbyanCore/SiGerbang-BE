use crate::database::db_utils::DbActor;
use crate::models::user_model::{ CreateUser, DeleteUser, GetUser, GetUsers, UpdateUser };
use crate::{ database::db_models::User, database::schema::user::dsl::* };
use actix::Handler;
use diesel::{ self, prelude::* };

impl Handler<GetUsers> for DbActor {
    type Result = QueryResult<Vec<User>>;

    fn handle(&mut self, _msg: GetUsers, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        user.get_results(&mut conn)
    }
}

impl Handler<CreateUser> for DbActor {
    type Result = QueryResult<User>;

    fn handle(&mut self, msg: CreateUser, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        diesel::insert_into(user).values(&msg.0).get_result(&mut conn)
    }
}

impl Handler<GetUser> for DbActor {
    type Result = QueryResult<User>;

    fn handle(&mut self, msg: GetUser, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        user.find(msg.id).get_result(&mut conn)
    }
}

impl Handler<UpdateUser> for DbActor {
    type Result = QueryResult<User>;

    fn handle(&mut self, msg: UpdateUser, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        diesel::update(user.find(msg.id)).set(&msg.data).get_result(&mut conn)
    }
}

impl Handler<DeleteUser> for DbActor {
    type Result = QueryResult<usize>;

    fn handle(&mut self, msg: DeleteUser, _ctx: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        diesel::delete(user.find(msg.id)).execute(&mut conn)
    }
}
