let allCharges = [];
let selectedCharges = new Map();

fetch("charges.json")
  .then(res => res.json())
  .then(data => {
    allCharges = data;
    renderChargeList(data);
  });

function renderChargeList(list) {
  const ul = document.getElementById("chargeList");
  ul.innerHTML = "";

  list.forEach(c => {
    const li = document.createElement("li");
    li.textContent = `${c.code} — ${c.name}`;
    li.onclick = () => addCharge(c);
    ul.appendChild(li);
  });
}

function addCharge(charge) {
  if (selectedCharges.has(charge.code)) return;

  selectedCharges.set(charge.code, charge);

  const ul = document.getElementById("selectedCharges");
  const li = document.createElement("li");
  li.dataset.code = charge.code;
  li.innerHTML = `
    ${charge.code} — ${charge.name}
    <button onclick="removeCharge('${charge.code}')">✖</button>
  `;
  ul.appendChild(li);
}

function removeCharge(code) {
  selectedCharges.delete(code);
  document
    .querySelector(`#selectedCharges li[data-code="${code}"]`)
    ?.remove();
}

document.getElementById("chargeSearch").addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  renderChargeList(
    allCharges.filter(c =>
      c.code.toLowerCase().includes(q) ||
      c.name.toLowerCase().includes(q)
    )
  );
});

function copyOutput() {
  const arrestee = document.getElementById("arrestee").value;
  const agency = document.getElementById("agency").value;
  const description = document.getElementById("description").value;
  const evidence = document.getElementById("evidence").value;

  const chargesText = [...selectedCharges.values()]
    .map(c => `- ${c.code} ${c.name}`)
    .join("\n");

  const markdown =
`**Arrestee:** ${arrestee}
**Agency:** ${agency}
**Charge(s):**
${chargesText || "- None"}

**Description:**
${description}

**Evidence:** ${evidence}`;

  const output = document.getElementById("output");
  output.value = markdown;
  output.select();
  document.execCommand("copy");
}

function clearAll() {
  document.getElementById("arrestee").value = "";
  document.getElementById("agency").value = "";
  document.getElementById("description").value = "";
  document.getElementById("evidence").value = "";
  document.getElementById("output").value = "";
  document.getElementById("selectedCharges").innerHTML = "";
  selectedCharges.clear();
}
