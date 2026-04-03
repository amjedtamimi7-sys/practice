frappe.ui.form.on("Employee Service Request", {

    employee: function (frm) {
        // --- 1. Configuration & Variables ---
        const fields_to_fetch = ["employee_name", "department", "company"];
        const employee_id = frm.doc.employee;

        // --- 2. Guard Clause (Safety First) ---
        // If no employee is selected, stop execution and clear fields
        if (!employee_id) {
            clear_all_fields(frm);
            return;
        }

        // --- 3. Main Logic (Data Fetching) ---
        fetch_employee_details(frm, employee_id, fields_to_fetch);
    }
});

// --- Helper Functions (To keep the main code clean) ---

function fetch_employee_details(frm, employee_id, fields) {
    frappe.db.get_value("Employee", employee_id, fields)
        .then(response => {
            if (response.message) {
                const data = response.message;

                // Set main fields
                frm.set_value("employee_name", data.employee_name || "");
                frm.set_value("department", data.department || "");
                frm.set_value("company", data.company || "");

                // Fetch linked data (Abbreviation)
                if (data.company) {
                    fetch_company_abbr(frm, data.company);
                }
            }
        });
}

function fetch_company_abbr(frm, company_name) {
    frappe.db.get_value("Company", company_name, "abbr")
        .then(res => {
            if (res.message) {
                frm.set_value("abbr", res.message.abbr || "");
            }
        });
}

function clear_all_fields(frm) {
    const fields = ["employee_name", "department", "company", "abbr"];
    fields.forEach(field => frm.set_value(field, ""));
}