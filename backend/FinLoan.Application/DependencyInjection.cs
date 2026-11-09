using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace FinLoan.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        // Automatically discover and register all FluentValidation validators in this assembly
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

        return services;
    }
}
