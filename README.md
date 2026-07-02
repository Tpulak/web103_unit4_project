# WEB103 Project 4 - *Bolt Bucket*

Submitted by: **Tanvir Pulak**

About this web app: **Bolt Bucket is a Chevrolet Bolt EV customizer where users can build, save, and manage custom car configurations with trim, color, wheels, and feature options.**

Time spent: **5** hours

## Required Features
The following **required** functionality is completed:
- [x] **The web app uses React to display data from the API.**
  - React pages fetch car and option data from Express API routes and render it in the customize, list, detail, and edit views.
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
  - [x] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x] **NOTE: Your walkthrough added to the README must include a demonstration of your table contents. Use the psql command 'SELECT * FROM tablename;' to display your table contents.**
  - The app connects to a Render Postgres database using a `cars` table (custom items), plus related tables for trims, colors, wheels, features, and a join table for car features.
- [x] **Users can view multiple features of the `CustomItem` (e.g. car) they can customize, (e.g. wheels, exterior, etc.)**
  - On the create/edit page, users can customize trim level, exterior color, interior, wheels, and optional features.
- [x] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
  - Each feature has multiple seeded options, such as 1LT/2LT trims, several exterior colors, interior choices, wheel styles, and add-on features.
- [x] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
  - The car preview box updates its background color when the user selects a different exterior color, with a car emoji shown in the preview area.
- [x] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected *OR* The app displays the total price of all features.**
  - The total price updates live as users change trim, color, wheels, and features, combining the base trim price with all selected option prices.
- [x] **The visual interface changes in response to at least one customizable feature.**
  - The preview box color and displayed configuration details change when the user selects different customization options.
- [x] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
  - Clicking **Create Car** sends the configuration to the backend and saves it in the `cars` table.
- [x] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
  - Invalid combinations, such as 2LT-only options on a 1LT or Heated Steering Wheel without Heated Front Seats, show an error and block saving.
- [x] **Users can view a list of all submitted `CustomItem`s.**
  - The **View Cars** page displays all saved custom cars with name, trim, color, and total price.
- [x] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
  - Each car card on the list page includes an **Edit** button that opens the edit form for that car.
- [x] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
  - Each car card includes a **Delete** button that removes the car from the database after confirmation.
- [x] **Users can update or delete `CustomItem`s that have been created from the detail page.**
  - The car detail page includes **Edit** and **Delete** buttons so users can update or remove a saved car from there as well.


The following **optional** features are implemented:

- [x] Selecting particular options prevents incompatible options from being selected even before form submission


## License

Copyright [yyyy] [name of copyright owner]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
