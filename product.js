function getProductByPage(page) {
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?page=${page}`,
        success: function (data) {
            let content = '';
            let products = data.content;
            for (let i = 0; i < products.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td><img src="http://localhost:8080/image/${products[i].image}" height="100"></td>
        <td>${products[i].category != null ? products[i].category.name : "-"}</td>
        <td><button class="btn btn-primary" data-target="#create-product" data-toggle="modal"
                                        type="button" onclick="showEditProduct(${products[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${products[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#product-list-content').html(content);
            let page = `<button class="btn btn-primary" id="backup" onclick="getProductByPage(${data.pageable.pageNumber}-1)">Previous</button>
    <span>${data.pageable.pageNumber + 1} | ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="getProductByPage(${data.pageable.pageNumber}+1)">Next</button>`
            $('#product-list-page').html(page);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
            }
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
            }
        }
    })
    event.preventDefault();
}

function findProductByName(page) {
    let q = $('#q').val();
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products?q=${q}&page=${page}`,
        success: function (data) {
            let content = '';
            let products = data.content;
            for (let i = 0; i < products.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${products[i].name}</td>
        <td>${products[i].price}</td>
        <td>${products[i].description}</td>
        <td><img src="http://localhost:8080/image/${products[i].image}"></td>
        <td>${products[i].category != null ? products[i].category.name : "-"}</td>
        <td><button class="btn btn-primary" data-target="#create-product" data-toggle="modal"
                                        type="button" onclick="showEditProduct(${products[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${products[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#product-list-content').html(content);
            let page = `<button class="btn btn-primary" id="backup" onclick="findProductByName(${data.pageable.pageNumber}-1)">Previous</button>
    <span>${data.pageable.pageNumber + 1} | ${data.totalPages}</span>
    <button class="btn btn-primary" id="next" onclick="findProductByName(${data.pageable.pageNumber}+1)">Next</button>`
            $('#product-list-page').html(page);
            if (data.pageable.pageNumber === 0) {
                document.getElementById("backup").hidden = true
            }
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                document.getElementById("next").hidden = true
            }
        }
    })
    event.preventDefault();
}

function createNewProduct() {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image');
    let category = $('#category').val();
    let product = new FormData();
    product.append('name', name);
    product.append('price', price);
    product.append('description', description);
    product.append('category', category);
    product.append('image', image.prop('files')[0])
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/products',
        data: product,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function () {
            getProductByPage();
            showSuccessMessage('Tạo thành công!');
        },
        error: function () {
            showErrorMessage('Tạo lỗi!');
        }
    })
}

function editProduct(id) {
    let name = $('#name').val();
    let price = $('#price').val();
    let description = $('#description').val();
    let image = $('#image').val();
    let category = $('#category').val();
    let product = {
        name: name,
        price: price,
        description: description,
        image: image,
        category: {
            id: category
        }
    }
    $.ajax({
        type: 'PUT',
        url: `http://localhost:8080/products/${id}`,
        data: JSON.stringify(product),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        success: function () {
            getProductByPage();
            showSuccessMessage('Sửa thành công!');
        },
        error: function () {
            showErrorMessage('Sửa lỗi!');
        }
    })
}

// function editProduct(id) {
//     let name = $('#name').val();
//     let price = $('#price').val();
//     let description = $('#description').val();
//     let image = $('#image');
//     let category = $('#category').val();
//     let product = new FormData();
//     product.append('name', name);
//     product.append('price', price);
//     product.append('description', description);
//     product.append('category', category);
//     product.append('image', image.prop('files')[0])
//     $.ajax({
//         type: 'PUT',
//         url: `http://localhost:8080/products/${id}`,
//         data: product,
//         enctype: 'multipart/form-data',
//         processData: false,
//         contentType: false,
//         success: function () {
//             getProductByPage();
//             showSuccessMessage('Sửa thành công!');
//         },
//         error: function () {
//             showErrorMessage('Sửa lỗi!');
//         }
//     })
// }

function showSuccessMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'success',
            title: message
        })
    });
}

function showErrorMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });

        Toast.fire({
            icon: 'error',
            title: message
        })
    });
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE',
        url: `http://localhost:8080/products/${id}`,
        success: function () {
            getProductByPage();
            showSuccessMessage('Xóa thành công!');
            // $('#delete-product').hide();
        },
        error: function () {
            showErrorMessage('Xóa lỗi');
        }
    })
}

function showDeleteProduct(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Xóa</button>`;
    $('#footer-delete').html(content);
}

function showEditProduct(id) {
    let title = 'Chỉnh sửa thông tin sản phẩm';
    let footer = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editProduct(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Cập nhật</button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    $.ajax({
        type: 'GET',
        url: `http://localhost:8080/products/${id}`,
        success: function (product) {
            $('#name').val(product.name);
            $('#price').val(product.price);
            $('#description').val(product.description);
            $('#image').val(product.image);
            drawCategory(product.category.id);
        }
    })
}

function showCreateProduct() {
    let title = 'Nhập thông tin sản phẩm';
    let footer = `   <button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="createNewProduct()" type="button" aria-label="Close" class="close" data-dismiss="modal">Tạo mới</button>`;
    $('#create-product-title').html(title);
    $('#create-product-footer').html(footer);
    $(`#name`).val(null);
    $(`#price`).val(null);
    $(`#quantity`).val(null);
    $(`#description`).val(null);
    $(`#image`).val(null);
    drawCategory();
}

function drawCategory(id) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/categories',
        success: function (categories) {
            // let content = `<option>Chọn danh mục</option>`
            // for (let category of categories) {
            //     content += `<option value="${category.id}">${category.name}</option>`
            // }
            let content = "";
            for (let i = 0; i < categories.length; i++) {
                if (id === categories[i].id) {
                    content += `<option value="${categories[i].id}" selected>${categories[i].name}</option>`
                } else {
                    content += `<option value="${categories[i].id}">${categories[i].name}</option>`
                }
            }
            $('#category').html(content);
        }
    })
    event.preventDefault();
}

$(document).ready(function () {
    getProductByPage();
})

