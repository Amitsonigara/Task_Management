-- Step 1: Check if the database exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'TaskManagement')
BEGIN
    -- Create the database if it doesn't exist
    CREATE DATABASE TaskManagement;
END

-- Step 2: Switch to the newly created or already existing database
USE TaskManagement;
GO

-- Step 3: Create the Users table
CREATE TABLE [dbo].[Users](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Username] [nvarchar](max) NOT NULL,
    [Email] [nvarchar](max) NOT NULL,
    [PasswordHash] [nvarchar](max) NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];
GO

-- Step 4: Create the Tasks table
CREATE TABLE [dbo].[Tasks](
    [Id] [int] IDENTITY(1,1) NOT NULL,
    [Title] [nvarchar](max) NOT NULL,
    [Description] [nvarchar](max) NOT NULL,
      NOT NULL,
    [Completed] [bit] NOT NULL,
      NOT NULL,
    [UserId] [int] NOT NULL,
    CONSTRAINT [PK_Tasks] PRIMARY KEY CLUSTERED 
    (
        [Id] ASC
    )WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY];
GO

-- Step 5: Add foreign key constraint for the Tasks table to reference Users
ALTER TABLE [dbo].[Tasks]  WITH CHECK ADD  CONSTRAINT [FK_Tasks_Users_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Users] ([Id])
ON DELETE CASCADE;
GO

ALTER TABLE [dbo].[Tasks] CHECK CONSTRAINT [FK_Tasks_Users_UserId];
GO
