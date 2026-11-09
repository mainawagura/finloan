using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace FinLoan.Infrastructure.Persistence;

public class FinLoanDbContext : DbContext
{
    public FinLoanDbContext(DbContextOptions<FinLoanDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Automatically scan and register all IEntityTypeConfiguration<T> Fluent API configurations
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Enforce automatic UTC auditing timestamps across all tracked entities
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

        var utcNow = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                var createdProp = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "CreatedAtUtc");
                if (createdProp != null && (createdProp.CurrentValue == null || (DateTime)createdProp.CurrentValue == default))
                {
                    createdProp.CurrentValue = utcNow;
                }
            }

            var updatedProp = entry.Properties.FirstOrDefault(p => p.Metadata.Name == "UpdatedAtUtc");
            if (updatedProp != null)
            {
                updatedProp.CurrentValue = utcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
