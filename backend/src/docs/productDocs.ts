/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management. All endpoints support the Accept-Language header for multilingual responses (en, vi).
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get paginated list of products
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en, vi]
 *         description: Preferred response language (en or vi)
 *         required: false
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
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
 *               - name
 *               - price
 *               - category
 *               - subcategory
 *             properties:
 *               name:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   vi:
 *                     type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   vi:
 *                     type: string
 *               subcategory:
 *                 type: object
 *                 properties:
 *                   en:
 *                     type: string
 *                   vi:
 *                     type: string
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products by name
 *     tags: [Products]
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en, vi]
 *         description: Preferred response language (en or vi)
 *         required: false
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         required: true
 *         description: Search keyword
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /products/{id}/like:
 *   post:
 *     summary: Like or unlike a product (toggle)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Accept-Language
 *         schema:
 *           type: string
 *           enum: [en, vi]
 *         description: Preferred response language (en or vi)
 *         required: false
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Like/unlike toggled
 *       400:
 *         description: Invalid product ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
