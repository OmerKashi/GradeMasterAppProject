namespace GradeMasterAPI.DB {

    public static class DbInitialzer { //All funcs and vars are static (ctor also can be)
        public static void Initialize(GradeMasterDbContext dbContext) { 
            dbContext.Database.EnsureCreated();

        
        }


    }
}
