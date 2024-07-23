using GradeMasterAPI.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

public class Program {
    public static void Main(string[] args) {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();

        // Register Global DB Service with EF
        builder.Services.AddDbContext<GradeMasterDbContext>(options => {
            options.UseSqlServer(builder.Configuration.GetConnectionString("GradeMasterDB"));
        });

        //builder.Services.AddAuthentication.AddJwtBearer(options => { })

        //builder.Services.AddSingleton<ICsvLodader, CsvLoader>();

        // Enable CORS 
        builder.Services.AddCors( options => {
            options.AddPolicy("AllowAllOrigins",
                builder => builder.AllowAnyOrigin()
                                  .AllowAnyMethod()
                                  .AllowAnyHeader());
        });

        var app = builder.Build();

        using (var scope = app.Services.CreateScope()) {
            try {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<GradeMasterDbContext>();
                DbInitialzer.Initialize(context);
            } catch (Exception ex) {
                // Handle exceptions
            }
        }

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment()) {
            app.UseSwagger();
            app.UseSwaggerUI();
        }

        app.UseHttpsRedirection();
        app.UseAuthorization();
        app.UseCors("AllowAllOrigins");
        app.MapControllers();
        app.Run();
    }
}
