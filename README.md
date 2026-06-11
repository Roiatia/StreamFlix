# StreamFlix

StreamFlix is a streaming-platform web project built for a college Web Development course.

The project started as a Netflix-style UI and was upgraded to use a simple MVC structure, MongoDB, Mongoose, and a posts feed. Users can log in, browse content, search movies and shows, and manage posts that are saved in MongoDB.

---

## Demo

### Login

![Login demo](public/images/demo/LOGIN.gif)

### Navigation

![Navigation demo](public/images/demo/NAVIGATION.gif)

### Content Search

![Search demo](public/images/demo/SEARCH.gif)

### Create Post

![Create post demo](public/images/demo/CREATE%20POST.gif)

### Edit Post

![Edit post demo](public/images/demo/EDIT%20POST.gif)

### Delete Post

![Delete post demo](public/images/demo/DELETE%20POST.gif)

### Filter Posts

![Filter post demo](public/images/demo/FILTER%20POST.gif)

---

## Features

- Login page with basic validation.
- Profile selection screen.
- StreamFlix home page with content rows.
- Navigation between movies, TV shows, games, new and popular, my list, and languages.
- Search for content by title, genre, type, description, or year.
- Personal watch/list state using `localStorage`.
- Posts feed stored in MongoDB.
- Create, edit, and delete posts.
- Search posts by title or content.
- Filter posts by author.
- Styled success and error messages for post actions.

---

## MVC And MongoDB

The project uses a simple MVC structure:

- `models/` contains the Mongoose model for posts.
- `controllers/` contains the logic for getting, creating, updating, and deleting posts.
- `routes/` defines the post API routes.
- `views/` contains the HTML pages.
- `public/` contains CSS, client-side JavaScript, images, content images, and demo GIFs.
- `config/` contains the MongoDB connection file.

The `Post` model is saved in MongoDB and includes:

- `title`
- `content`
- `author`
- `createdAt`
- `updatedAt`

The date fields are created automatically by Mongoose timestamps.

---

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/posts` | Get all posts from MongoDB |
| `POST` | `/posts` | Create a new post |
| `PUT` | `/posts/:id` | Edit an existing post |
| `DELETE` | `/posts/:id` | Delete a post |

All post routes return JSON responses with success or error messages.

---

## How To Run

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the project root.

3. Add your MongoDB connection string in this format:

```env
MONGO_URI=your_mongodb_connection_string
```

4. Start the server:

```bash
npm start
```

5. Open the app:

```text
http://localhost:3000
```

Test login:

```text
Email: test@example.com
Password: 123456
```

---

## Project Structure

```text
StreamFlix/
|-- config/
|   `-- db.js
|-- controllers/
|   `-- postController.js
|-- data/
|   |-- content.json
|   `-- personas.json
|-- models/
|   `-- postModel.js
|-- public/
|   |-- css/
|   |   |-- LoginPage.css
|   |   |-- interface.css
|   |   `-- users.css
|   |-- js/
|   |   |-- content.js
|   |   |-- login.js
|   |   |-- nav.js
|   |   |-- profiles.js
|   |   `-- search.js
|   |-- images/
|   |   `-- demo/
|   `-- content-images/
|-- routes/
|   `-- postRoutes.js
|-- views/
|   |-- index.html
|   |-- interface.html
|   `-- UserScreen.html
|-- .gitignore
|-- package.json
|-- server.js
`-- README.md
```

---

## Technologies Used

| Technology | Purpose |
| --- | --- |
| HTML | Page structure |
| CSS | Styling and layout |
| JavaScript | Client-side behavior |
| Bootstrap | Responsive UI helpers |
| Node.js | Server runtime |
| Express | Web server and routes |
| MongoDB | Database for posts |
| Mongoose | MongoDB model and queries |
| dotenv | Environment variables |

---

## Assignment Notes

- The project uses MVC separation for the posts feature.
- Posts are stored in MongoDB, not in a server memory array.
- Post deletion uses `fetch` and removes the post from the page without refreshing.
- The `.env` file is not submitted because it contains the MongoDB connection string.
- `node_modules/` is not submitted.
- The MongoDB connection string should stay private.

---

## Disclaimer

This project was created for educational purposes only.

StreamFlix is a student project inspired by streaming services. It is not connected to Netflix or any other real streaming platform.
