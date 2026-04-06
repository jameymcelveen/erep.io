using api.Interfaces;
using api.Options;
using api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DefenseDraftOptions>(opts =>
{
    builder.Configuration.GetSection(DefenseDraftOptions.SectionName).Bind(opts);
    if (string.IsNullOrWhiteSpace(opts.OpenAiApiKey))
    {
        opts.OpenAiApiKey = builder.Configuration["OPENAI_API_KEY"] ?? "";
    }
});

builder.Services.AddHttpClient();
builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteDev", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IStatusService, StatusService>();
builder.Services.AddScoped<IDefenseDraftService, DefenseDraftService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("ViteDev");
app.UseAuthorization();
app.MapControllers();

app.Run();
