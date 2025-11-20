# Admin CMS Portal

## Default Admin Credentials

**Email:** `admin@studyplanner.com`  
**Password:** `Admin@123`

⚠️ **IMPORTANT:** Change the password after your first login!

## How It Works

When you log in with the admin credentials, you will be automatically redirected to the **Admin CMS Portal** instead of the student portal.

### Admin Features

1. **Overview Dashboard**
   - Total users count
   - Total subjects count
   - Total assignments count
   - Total study rooms count

2. **User Management**
   - View all registered users
   - Delete non-admin users
   - See user creation dates and admin status

3. **Subjects Management**
   - View all subjects across all users
   - Delete any subject
   - See subject owner information

4. **Assignments Management**
   - View all assignments across all users
   - Delete any assignment
   - See assignment details and due dates

5. **Study Rooms Management**
   - View all study rooms
   - Delete any study room
   - See Google Meet links

## Creating Additional Admin Accounts

To create a new admin account or reset the default admin:

```bash
cd server
node createAdmin.js
```

## Manual Admin Account Creation

If you want to create an admin manually:

1. Register a new user through the normal registration process
2. Connect to your MongoDB database
3. Find the user in the `users` collection
4. Set `isAdmin: true` for that user
5. The user will now have admin access on next login

## Student vs Admin Access

- **Regular users**: Access to student portal (study planner, assignments, study rooms)
- **Admin users**: Access to Admin CMS portal (full management capabilities)
- The system automatically routes users based on their `isAdmin` status

## Security Notes

- Admin routes are protected with JWT authentication
- Only users with `isAdmin: true` can access admin endpoints
- Admin users cannot be deleted through the admin panel
- Always use strong passwords for admin accounts
