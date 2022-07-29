const { nanoid } = require('nanoid');
const db = require('./books');

const addBook = (req, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;

    const id = nanoid(16);
    let finished = false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    if (readPage === pageCount) {
        finished = true;
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    db.push(newBook);
    const isSuccess = db.filter((e) => e.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
};

const getAllBooks = (req, h) => {
    let books = db.map((e) => ({ id: e.id, name: e.name, publisher: e.publisher }));
    const que = req.query;
    const keys = Object.keys(que);
    const a = keys[0];
    const b = keys[1];
    const c = keys[2];

    if (a !== undefined) {
        if (b !== undefined) {
            const index = keys.indexOf('name');

            if (c !== undefined) {
                const isName = que.name.toLowerCase();
                keys.splice(index, 1);
                const newA = keys[0];
                const newB = keys[1];
                const finding = db.filter((e) => e.name.toLowerCase().includes(isName) && e[newA] == que[newA] && e[newB] == que[newB]);

                if ((que.reading == 0 || que.reading == 1) && (que.finished == 0 || que.finished == 1)) {
                    books = finding.map((e) => ({ id: e.id, name: e.name, publisher: e.publisher }));
                    const response = h.response({
                        status: 'success',
                        data: {
                            books,
                        },
                    });
                    response.code(200);
                    return response;
                }

                const response = h.response({
                    status: 'success',
                    data: {
                        books,
                    },
                });
                response.code(200);
                return response;
            }
            // ========================================================================================
            let finding = db.filter((e) => e[a] == que[a] && e[b] == que[b]);
            if ('name' in que) {
                const isName = que.name.toLowerCase();
                keys.splice(index, 1);
                const newA = keys[0];
                finding = db.filter((e) => e.name.toLowerCase().includes(isName) && e[newA] == que[newA]);
                books = finding.map((e) => ({ id: e.id, name: e.name, publisher: e.publisher }));
                const response = h.response({
                    status: 'success',
                    data: {
                        books,
                    },
                });
                response.code(200);
                return response;
            }

            if ((que.reading == 0 || que.reading == 1) && (que.finished == 0 || que.finished == 1)) {
                books = finding.map((e) => ({ id: e.id, name: e.name, publisher: e.publisher }));
                const response = h.response({
                    status: 'success',
                    data: {
                        books,
                    },
                });
                response.code(200);
                return response;
            }

            const response = h.response({
                status: 'success',
                data: {
                    books,
                },
            });
            response.code(200);
            return response;
        }
        // ========================================================================================
        let finding = db.filter((e) => e[a] == que[a]);
        if ('name' in que) {
            const isName = que.name.toLowerCase();
            finding = db.filter((e) => e.name.toLowerCase().includes(isName));
            books = finding.map((e) => ({ id: e.id, name: e.name, publisher: e.publisher }));
            const response = h.response({
                status: 'success',
                data: {
                    books,
                },
            });
            response.code(200);
            return response;
        }
        if (que.reading == 0 || que.reading == 1 || que.finished == 0 || que.finished == 1) {
            books = finding.map((e) => ({ id: e.id, name: e.name, publisher: e.publisher }));
            const response = h.response({
                status: 'success',
                data: {
                    books,
                },
            });
            response.code(200);
            return response;
        }

        const response = h.response({
            status: 'success',
            data: {
                books,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'success',
        data: {
            books,
        },
    });
    response.code(200);
    return response;
};

const getBookById = (req, h) => {
    const { bookId } = req.params;

    const book = db.filter((e) => e.id === bookId)[0];

    if (book !== undefined) {
        const response = h.response({
            status: 'success',
            data: {
                book,
            },
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
};

const editBook = (req, h) => {
    const { bookId } = req.params;

    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = req.payload;
    const updatedAt = new Date().toISOString();
    let finished = false;

    if (readPage === pageCount) {
        finished = true;
    }

    const index = db.findIndex((e) => e.id === bookId);

    if (name === undefined) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    if (index !== -1) {
        db[index] = {
            ...db[index], name, year, author, summary, publisher, pageCount, readPage, finished, reading, updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

const deleteBook = (req, h) => {
    const { bookId } = req.params;

    const index = db.findIndex((e) => e.id === bookId);

    if (index !== -1) {
        db.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addBook, getAllBooks, getBookById, editBook, deleteBook,
};
