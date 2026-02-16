import "./style.css";
const inputTodo = document.querySelector<HTMLInputElement>("#todo-input");
const buttonAdd = document.querySelector<HTMLButtonElement>("#add-todo-button");
const todoElements = document.querySelector<HTMLUListElement>("#todo-elements");
const errorInput = document.querySelector<HTMLParagraphElement>("#error");

if (!inputTodo || !buttonAdd || !todoElements || !errorInput) {
    throw new Error(
        "Un ou plusieurs éléments DOM sont introuvables. Vérifiez les IDs dans index.html.", //many DOM elements weren't
    );
}
const addElement = () => {
    const text = inputTodo.value.trim();
    if (!text) {
        errorInput.removeAttribute("hidden");
        return;
    }
    errorInput.setAttribute("hidden", "");
    const newLi = document.createElement("li");
    newLi.textContent = text;
    todoElements.appendChild(newLi);
    inputTodo.value = "";
};

inputTodo.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addElement();
    }
});
buttonAdd.addEventListener("click", () => {
    addElement();
});
