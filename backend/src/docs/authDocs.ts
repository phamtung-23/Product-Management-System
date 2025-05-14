/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication. All endpoints support the Accept-Language header for multilingual responses (en, vi).
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en, vi]
 *         description: Preferred response language (en or vi)
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid input
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en, vi]
 *         description: Preferred response language (en or vi)
 *         required: false
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       400:
 *         description: Invalid credentials
 */
