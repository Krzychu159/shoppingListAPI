function renderItem(item, index) {
  return `
    <div data-index="${index}" class="item ${item.completed ? "checked" : ""}">
        <input type="checkbox" ${item.completed ? "checked" : ""}>
        <p>${item.content}</p>
        ${!item.completed ? `<button class="edit">Edytuj</button>` : ""}
        <button class="delete">Usuń</button>
    </div>
`;
}

function renderEditItem(item) {
  return `
        <input value="${item.content}" class="edited-item">
        <button class="save">Zapisz</button>
`;
}

export function renderApp(rootNode, onDeleteItem, onAddItem, onChangeItem) {
  let shoppingList;

  let editedItemIndex = null;
  rootNode.innerHTML = `
        <div>
            <div>
                <h1>Lista zakupów</h1>
                <div id="add-row">
                    <input type="text" placeholder="Dodaj zakup"/>
                    <button class="add">Dodaj</button>
                </div>
            </div>
                <div id="shopping-list">
                    
                </div>
            <div>
            </div>
        </div>
    `;

  function renderShoppingList(items) {
    shoppingList = items;
    rootNode.querySelector("#shopping-list").innerHTML = items.length
      ? items.map(renderItem).join("")
      : `<p class="empty">Lista pusta 🎉</p>`;
  }

  function renderAddItem(item) {
    shoppingList.push(item);
    renderShoppingList(rootNode, shoppingList);
  }

  function renderEditedItem(item) {
    shoppingList[editedItemIndex] = item;

    const tempNode = document.createElement("div");
    tempNode.innerHTML = renderItem(
      shoppingList[editedItemIndex],
      editedItemIndex
    );

    const editedItem = rootNode.querySelector(
      `[data-index="${editedItemIndex}"]`
    );
    editedItem.replaceWith(tempNode.firstElementChild);

    editedItem.classList.remove("edited-item");
    editedItemIndex = null;
  }

  rootNode.addEventListener("click", (e) => {
    const parent = e.target.parentNode;
    if (e.target.classList.contains("add")) {
      const input = parent.querySelector("input");

      const content = input.value;
      const newItem = { content, completed: false };

      input.value = "";

      onAddItem(newItem, renderAddItem);
    }

    if (e.target.classList.contains("edit")) {
      if (editedItemIndex !== null) {
        return;
      }

      const index = Number(parent.dataset["index"]);
      editedItemIndex = index;
      parent.classList.add("edited-item");
      parent.innerHTML = renderEditItem(shoppingList[index]);
    }

    if (e.target.classList.contains("save")) {
      const content = parent.querySelector("input").value;
      shoppingList[editedItemIndex].content = content;

      onChangeItem(shoppingList[editedItemIndex], renderEditedItem);
    }

    if (e.target.classList.contains("delete")) {
      const index = Number(parent.dataset["index"]);
      onDeleteItem(shoppingList[index], (element) => {
        shoppingList.splice(index, 1);
        renderShoppingList(rootNode, shoppingList);
      });
    }
  });

  rootNode.addEventListener("change", (e) => {
    if (e.target.type === "checkbox") {
      const parent = e.target.parentNode;
      const index = Number(parent.dataset["index"]);
      editedItemIndex = index;
      shoppingList[editedItemIndex].completed = e.target.checked;

      onChangeItem(shoppingList[editedItemIndex], renderEditedItem);
    }
  });

  return { renderShoppingList };
}
