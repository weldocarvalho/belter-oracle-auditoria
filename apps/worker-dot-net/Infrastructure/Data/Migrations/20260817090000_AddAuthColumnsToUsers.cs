using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ServiceWorker.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthColumnsToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "auth_provider",
                table: "users",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "credentials");

            migrationBuilder.AddColumn<string>(
                name: "password_hash",
                table: "users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "google_subject",
                table: "users",
                type: "character varying(255)",
                maxLength: 255,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "ix_users_google_subject",
                table: "users",
                column: "google_subject",
                unique: true,
                filter: "\"google_subject\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_users_google_subject",
                table: "users");

            migrationBuilder.DropColumn(
                name: "google_subject",
                table: "users");

            migrationBuilder.DropColumn(
                name: "password_hash",
                table: "users");

            migrationBuilder.DropColumn(
                name: "auth_provider",
                table: "users");
        }
    }
}
