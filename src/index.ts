import { Prisma, PrismaClient } from "@prisma/client";
import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import pkg from "../package.json";

const prisma = new PrismaClient();
const app = express();

const openapiSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: pkg.name,
      version: pkg.version,
    },
  },
  apis: ["src/*.ts"],
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

app.use(express.json());

app.get("/api/books", (req, res) => {
  res.json({
    data: [
      { id: 1, name: "Witcher" },
      { id: 2, name: "Lord of the Rings" },
      { id: 3, name: "Dune" },
    ],
  });
});

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Retrieve a list of users
 *     description: User list
 *     responses:
 *       200:
 *         description: Successfully returned a users list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: User id
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Username
 */
app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany({});

  res.json(users);
});

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Creates new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             name: user data
 *             required: true
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: test@test.pl
 *
 *     responses:
 *       200:
 *         description: Successfully returned a users list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: User id
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Username
 */

app.post("/api/users", async (req, res) => {
  const data = req.body;

  if (!data.name || !data.email) {
    return res
      .status(400)
      .json({ error: "name or email is missing in user data!" });
  }

  const { name, email } = data;

  if (typeof data.name !== "string" || typeof data.email !== "string") {
    return res
      .status(400)
      .json({ error: "name or email have wrong data types!" });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });

  res.json(user);
});

app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: Number(id),
      },
    });

    res.json(user);
  } catch (e) {
    res.status(404).json({});
  }
});


/**
 * @openapi
 * /api/users/{id}: 
 *   delete:
 *     summary: Removes user
 *     responses:
 *       200:
 *         description: Successfully removed a user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User with id 255 was deleted
 *       400:
 *         description: Id has wrong data type
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Id has wrong data type
 *       404:
 *         description: No user with given id
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: There is no user with id 255
 *   parameters:
 *   - name: id
 *     in: path
 *     description: Id of the user to be removed 
 *     required: true
*/

app.delete("/api/users/:id", async (req, res) => {
  const { id } = req.params;

  if (typeof id !== "string") {
    res
      .status(400)
      .json("Id has wrong data type");
  }

  try {
    const user = await prisma.user.delete({
      where: {
        id: Number(id),
      },
    });

    res.json(`User with id ${id} was deleted`);
  } catch (e) {
    res.status(404).json(`There is no user with id ${id}`);

  }
});

/**
 * @openapi
 * /api/users/{id}: 
 *   put:
 *     summary: Updates user data 
 * 
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             name: user data
 *             required: true
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: test@test.pl
 *
 *     responses:
 *       200:
 *         description: Successfully removed a user
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       400:
 *         description: Data are not provided or Id has wrong data type
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: No user with given id
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Id of the user to be updated 
 *       required: true
*/

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  if (typeof id !== "string") {
    res
      .status(400)
      .json("Id has wrong data type. It should be string.");
  }

  if (!data) {
    res
      .status(400)
      .json("Data are not provided");
  }

  try {
    const user = await prisma.user.update({
      where: {
        id: Number(id)
      },
      data: data
    });

    res.json(`${id} user data updated`);
  } catch (e) {
    res.status(404).json(`User with id ${id} not found`);
  }
});

const server = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
);
