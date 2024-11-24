const CLIENT_ID = '24618b94a256f24'; // Thay bằng Client ID của bạn

const users = [
  { name: 'Nguyen Van A', dob: '2000-01-01' },
  { name: 'Tran Thi B', dob: '2001-05-15' }
];

// Xử lý đăng nhập chỉ 1 lần
document.getElementById('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const dob = document.getElementById('dob').value;

  const user = users.find(user => user.name === name && user.dob === dob);
  if (user) {
    document.getElementById('login-page').classList.add('hidden');
    document.getElementById('main-page').classList.remove('hidden');
    loadImages(); // Tải lại ảnh khi đăng nhập thành công
  } else {
    document.getElementById('login-error').textContent = 'Sai thông tin đăng nhập!';
  }
});

// Chế độ sáng tối
document.getElementById('toggle-theme').addEventListener('click', () => {
  const body = document.body;
  body.classList.toggle('light-mode');
  body.classList.toggle('dark-mode');
});

// Xử lý tải ảnh lên Imgur và lưu vào localStorage
document.getElementById('upload-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const fileInput = document.getElementById('file-input');
  const commentInput = document.getElementById('comment-input');
  const file = fileInput.files[0];
  const comment = commentInput.value.trim();

  if (!file) {
    alert('Vui lòng chọn một ảnh!');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: { Authorization: `Client-ID ${CLIENT_ID}` },
      body: formData,
    });

    const data = await response.json();
    if (data.success) {
      const imgUrl = data.data.link;

      // Lưu ảnh và bình luận vào localStorage
      const images = JSON.parse(localStorage.getItem('images')) || [];
      images.push({ imgUrl, comment });
      localStorage.setItem('images', JSON.stringify(images));

      // Hiển thị ảnh
      displayImage(imgUrl, comment);
      alert('Tải ảnh thành công!');
    } else {
      alert('Lỗi tải ảnh: ' + data.data.error);
    }
  } catch (error) {
    console.error('Lỗi tải ảnh:', error);
    alert('Tải ảnh thất bại!');
  }
});

// Hàm hiển thị ảnh từ Imgur và tạo nút xóa
function displayImage(imgUrl, comment) {
  const img = document.createElement('img');
  img.src = imgUrl;
  img.alt = comment || 'Ảnh không có chú thích';

  const commentDiv = document.createElement('div');
  commentDiv.textContent = comment || 'Không có bình luận.';

  // Tạo phần chứa ảnh
  const galleryItem = document.createElement('div');
  galleryItem.classList.add('gallery-item');
  
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('delete-btn');
  deleteBtn.innerHTML = '×';
  deleteBtn.addEventListener('click', (event) => {
    event.stopPropagation(); // Ngừng sự kiện bubble để không kích hoạt ảnh
    galleryItem.remove(); // Xóa ảnh khi nhấn nút xóa
    removeImageFromStorage(imgUrl); // Xóa ảnh khỏi localStorage
  });

  // Khi nhấn vào ảnh, thêm lớp 'active' vào galleryItem để hiển thị nút xóa
  galleryItem.addEventListener('click', () => {
    galleryItem.classList.toggle('active');
  });

  galleryItem.appendChild(img);
  galleryItem.appendChild(commentDiv);
  galleryItem.appendChild(deleteBtn);

  // Hiển thị ảnh và bình luận vào gallery
  document.getElementById('gallery').appendChild(galleryItem);
}

// Hàm xóa ảnh khỏi localStorage
function removeImageFromStorage(imgUrl) {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  const updatedImages = images.filter(image => image.imgUrl !== imgUrl);
  localStorage.setItem('images', JSON.stringify(updatedImages));
}

// Hàm tải ảnh từ localStorage khi trang được tải lại
function loadImages() {
  const images = JSON.parse(localStorage.getItem('images')) || [];
  const gallery = document.getElementById('gallery');
  images.forEach(({ imgUrl, comment }) => {
    displayImage(imgUrl, comment);
  });
}
