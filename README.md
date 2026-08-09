# Campus Eats

Make website. Use the attacked document and use the information what should be included:

Hierarchical Input Structure

Main Menu

1.    User Management.

2.    Vendor Management.

3.    Menu Management.

4.    Order Management.

#1: User Management

1st Level

1.    Register User.

2.    Login.

2nd Level

1.    Register User.

1.1. Name.

1.2. Email.

1.3. Password.

1.4. Role (Student, Vendor, Admin).

2.    Login.

2.1. Email.

2.2. Password.

#2: Vendor Management

1st Level

1.    Register Vendor.

2.    Update Vendor Details.

2nd Level

1.    Register Vendor.

1.1. Vendor Name.

1.2. Location.

1.3. Contact Number.

2.    Update Vendor Details

2.1. Vendor ID.

2.2. Name.

2.3. Location.

#3: Menu Management

1st Level

1.    Add Menu Item

2.    Update Menu Item

3.    Remove Menu Item

2nd Level

1.    Add Menu Item

1.1. Item Name

1.2. Price

1.3. Vendor ID

2.    Update Menu Item

2.1. Item ID

2.2. Name

2.3. Price

3.    Remove Menu Item

3.1. Item ID

#4: Order Management

1st Level

1.    Place Order

2.    Update Order Status

2nd Level

1.    Place Order

1.1. User ID

1.2. Select Item

1.3. Quantity

1.4. Confirm Order

2.    Update Order Status

2.1. Order ID

2.2. Status (Pending, Preparing, Completed)

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://campus-eats-platform.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f1dad3af-3012-4cf7-8f82-87b356c2c979).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
