use crate::database::db_utils::DbActor;
use crate::models::grub_model::{ CreateGrub, DeleteGrub, GetGrub, GetGrubs, UpdateGrub };
use crate::{ database::db_models::Grub, database::schema::grub::dsl::* };
use actix::Handler;
use diesel::{ self, prelude::* };

// CRUD handlers

impl Handler<GetGrubs> for DbActor {
    type Result = QueryResult<Vec<Grub>>;

    fn handle(&mut self, _: GetGrubs, _: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        grub.load(&mut conn)
    }
}

impl Handler<GetGrub> for DbActor {
    type Result = QueryResult<Grub>;

    fn handle(&mut self, msg: GetGrub, _: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        grub.filter(uuid.eq(&msg.uuid)).get_result(&mut conn)
    }
}

impl Handler<CreateGrub> for DbActor {
    type Result = QueryResult<Grub>;

    fn handle(&mut self, msg: CreateGrub, _: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        diesel::insert_into(grub).values(&msg.0).get_result(&mut conn)
    }
}

impl Handler<UpdateGrub> for DbActor {
    type Result = QueryResult<Grub>;

    fn handle(&mut self, msg: UpdateGrub, _: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        diesel
            ::update(grub.filter(uuid.eq(&msg.uuid)))
            .set(&msg.data)
            .get_result(&mut conn)
    }
}

impl Handler<DeleteGrub> for DbActor {
    type Result = QueryResult<usize>;

    fn handle(&mut self, msg: DeleteGrub, _: &mut Self::Context) -> Self::Result {
        let mut conn = self.0.get().expect("Failed to get db connection");
        diesel::delete(grub.filter(uuid.eq(&msg.uuid))).execute(&mut conn)
    }
}
