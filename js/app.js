// Variables globales
const studentsList = document.getElementById('studentsList');
const template = document.getElementById('studentCardTemplate');
const searchInput = document.getElementById('studentSearch');
let allStudents = []; // Almacenar todos los estudiantes
let allTechnologies = []; // Almacenar todas las tecnologías disponibles

// Cargar estudiantes y tecnologías automáticamente cuando la página se carga
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar tecnologías disponibles
        allTechnologies = await api.getTechnologies();
        // Cargar estudiantes
        await renderStudents();
    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
    }
});

// Función para crear estrellas de valoración
function createRatingStars(level) {
    const maxStars = 5;
    const container = document.createElement('div');
    container.className = 'd-flex flex-column align-items-center gap-2';
    
    // Asegurarnos de que level sea un número entre 1 y 5
    const rating = Math.min(Math.max(parseInt(level) || 0, 0), 5);
    
    // Contenedor para las estrellas
    const starsContainer = document.createElement('div');
    starsContainer.className = 'd-flex gap-2 align-items-center justify-content-center';
    
    for (let i = 1; i <= maxStars; i++) {
        const star = document.createElement('i');
        if (i <= rating) {
            // Estrella llena en amarillo
            star.className = 'fa-solid fa-star text-warning';
        } else {
            // Estrella vacía en gris
            star.className = 'fa-regular fa-star text-secondary';
        }
        star.style.fontSize = '1.3em';
        starsContainer.appendChild(star);
    }
    
    // Texto con el nivel
    const levelText = document.createElement('div');
    levelText.className = 'text-muted mt-1';
    levelText.style.fontSize = '0.9em';
    levelText.textContent = `Nivel ${rating}`;
    
    container.appendChild(starsContainer);
    container.appendChild(levelText);
    
    return container;
}

// Función para crear un badge de tecnología
function createTechnologyBadge(technology) {
    const container = document.createElement('div');
    container.className = 'technology-item bg-light rounded p-3 mb-2 shadow-sm';
    container.style.minWidth = '200px';
    container.style.textAlign = 'center';
    
    const nameSpan = document.createElement('div');
    nameSpan.className = 'fw-bold mb-3';
    nameSpan.style.fontSize = '1.1em';
    nameSpan.textContent = technology.name;
    
    container.appendChild(nameSpan);
    container.appendChild(createRatingStars(technology.level));
    
    return container;
}

// Función para mostrar detalles del estudiante
async function showStudentDetails(student) {
    const detailsModal = new bootstrap.Modal(document.getElementById('studentDetailsModal'));
    
    // Actualizar los elementos del modal con la información del estudiante
    document.getElementById('detailStudentImage').src = student.photo;
    document.getElementById('detailStudentName').textContent = student.name;
    document.getElementById('detailStudentCode').textContent = student.code;
    document.getElementById('detailStudentEmail').textContent = student.email;
    const githubLink = document.getElementById('detailStudentGithub');
    githubLink.href = `https://github.com/${student.github}`;
    githubLink.textContent = student.github;
    
    // Obtener y mostrar las tecnologías del estudiante
    try {
        const studentTechnologies = await api.getStudentTechnologies(student.code);
        const techContainer = document.getElementById('studentTechnologies');
        techContainer.innerHTML = '';
        
        if (studentTechnologies && studentTechnologies.length > 0) {
            studentTechnologies.forEach(techData => {
                console.log('Datos de tecnología:', techData); // Para debug
                const tech = {
                    name: techData.technology.name,
                    level: parseInt(techData.level) // Aseguramos que level sea un número
                };
                techContainer.appendChild(createTechnologyBadge(tech));
            });
        } else {
            techContainer.innerHTML = '<p class="text-muted">No hay tecnologías registradas</p>';
        }
    } catch (error) {
        console.error('Error al cargar las tecnologías:', error);
        document.getElementById('studentTechnologies').innerHTML = 
            '<p class="text-danger">Error al cargar las tecnologías</p>';
    }
    
    detailsModal.show();
}

// Función de búsqueda
function filterStudents(searchTerm) {
    const term = searchTerm.toLowerCase();
    return allStudents.filter(student => 
        student.name.toLowerCase().includes(term) ||
        student.code.toLowerCase().includes(term)
    );
}

// Función para abrir el modal de edición
function openEditModal(student) {
    const modal = new bootstrap.Modal(document.getElementById('editStudentModal'));
    
    // Llenar el formulario con los datos actuales
    document.getElementById('editStudentCode').value = student.code;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentGithub').value = student.github;
    document.getElementById('editStudentPhoto').value = student.photo;
    
    modal.show();
}

// Función para renderizar estudiantes filtrados
function renderFilteredStudents(students) {
    studentsList.innerHTML = '';
    if (students.length === 0) {
        studentsList.innerHTML = `
            <div class="col-12 text-center mt-4">
                <p class="text-muted">No se encontraron estudiantes que coincidan con la búsqueda</p>
            </div>`;
        return;
    }
    
    students.forEach(student => {
        const clone = template.content.cloneNode(true);
        
        clone.querySelector('.student-name').textContent = student.name;
        clone.querySelector('.student-id').textContent = `ID: ${student.code}`;
        clone.querySelector('.student-email').textContent = student.email;
        clone.querySelector('.student-image').src = student.photo;

        const card = clone.querySelector('.card');
        card.style.cursor = 'pointer';
        card.addEventListener('click', async () => await showStudentDetails(student));

        // Agregar evento al botón de editar
        const editButton = clone.querySelector('.btn-edit');
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se abra el modal de detalles
            openEditModal(student);
        });

        clone.querySelector('.github-link').href = `https://github.com/${student.github}`;
        clone.querySelector('.github-link').addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        studentsList.appendChild(clone);
    });
}

// Event listener para la búsqueda
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value;
    const filteredStudents = filterStudents(searchTerm);
    renderFilteredStudents(filteredStudents);
});

// Render students
async function renderStudents() {
    try {
        allStudents = await api.getStudents();
        renderFilteredStudents(allStudents);
    } catch (error) {
        console.error('Error al cargar estudiantes:', error);
        studentsList.innerHTML = `
            <div class="col-12 text-center mt-4">
                <p class="text-danger">Error al cargar los estudiantes. Por favor, intente nuevamente.</p>
            </div>`;
    }
}

const btnLoad = document.getElementById('loadStudent');
const btnNew = document.getElementById('addNewStudent');

btnLoad.addEventListener('click', async () => {
    await renderStudents();
});

btnNew.addEventListener('click', () => {
    const modal = new bootstrap.Modal(document.getElementById('addStudentModal'));
    modal.show();
});

document.getElementById('saveStudent').addEventListener('click', async () => {
    const studentData = {
        name: document.getElementById('studentName').value,
        code: document.getElementById('studentCode').value,
        email: document.getElementById('studentEmail').value,
        github: document.getElementById('studentGithub').value,
        photo: document.getElementById('studentPhoto').value
    };

    try {
        await api.addStudent(studentData);
        const modal = bootstrap.Modal.getInstance(document.getElementById('addStudentModal'));
        modal.hide();
        document.getElementById('addStudentForm').reset();
        await renderStudents();
    } catch (error) {
        console.error('Error al guardar el estudiante:', error);
        alert('Error al guardar el estudiante. Por favor, intente nuevamente.');
    }
});

// Event listener para actualizar estudiante
document.getElementById('updateStudent').addEventListener('click', async () => {
    const studentData = {
        code: document.getElementById('editStudentCode').value,
        name: document.getElementById('editStudentName').value,
        email: document.getElementById('editStudentEmail').value,
        github: document.getElementById('editStudentGithub').value,
        photo: document.getElementById('editStudentPhoto').value
    };

    try {
        await api.updateStudent(studentData.code, studentData);
        const modal = bootstrap.Modal.getInstance(document.getElementById('editStudentModal'));
        modal.hide();
        
        // Actualizar la lista de estudiantes
        await renderStudents();
        
        // Mostrar mensaje de éxito
        alert('Estudiante actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar el estudiante:', error);
        alert('Error al actualizar el estudiante. Por favor, intente nuevamente.');
    }
});

// Event listener para el botón de agregar tecnología
document.getElementById('addTechnologyBtn').addEventListener('click', async () => {
    const studentCode = document.getElementById('detailStudentCode').textContent;
    document.getElementById('technologyStudentCode').value = studentCode;
    
    // Llenar el select de tecnologías
    const select = document.getElementById('technologySelect');
    select.innerHTML = '<option value="">Selecciona una tecnología</option>';
    
    allTechnologies.forEach(tech => {
        const option = document.createElement('option');
        option.value = tech.code;
        option.textContent = tech.name;
        select.appendChild(option);
    });
    
    const modal = new bootstrap.Modal(document.getElementById('addTechnologyModal'));
    modal.show();
});

// Event listener para el rango de nivel
document.getElementById('technologyLevel').addEventListener('input', (e) => {
    document.getElementById('technologyLevelValue').textContent = e.target.value;
});

// Event listener para guardar tecnología
document.getElementById('saveTechnology').addEventListener('click', async () => {
    const studentCode = document.getElementById('technologyStudentCode').value;
    const technologyCode = document.getElementById('technologySelect').value;
    const level = document.getElementById('technologyLevel').value;
    
    if (!technologyCode) {
        alert('Por favor, selecciona una tecnología');
        return;
    }
    
    try {
        await api.addStudentTechnology({
            student_code: studentCode,
            technology_code: technologyCode,
            level: parseInt(level)
        });
        
        // Cerrar el modal de tecnología
        const techModal = bootstrap.Modal.getInstance(document.getElementById('addTechnologyModal'));
        techModal.hide();
        
        // Actualizar la vista de tecnologías
        const student = allStudents.find(s => s.code === studentCode);
        if (student) {
            await showStudentDetails(student);
        }
        
    } catch (error) {
        console.error('Error al agregar tecnología:', error);
        alert('Error al agregar la tecnología. Por favor, intente nuevamente.');
    }
});
