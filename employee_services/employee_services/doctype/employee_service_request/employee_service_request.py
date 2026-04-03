# Copyright (c) 2026, amjed and contributors
import frappe
from frappe.model.document import Document

class EmployeeServiceRequest(Document):
    def validate(self):
        """Main validation step before saving the document."""
        self.fetch_and_set_employee_details()

    def fetch_and_set_employee_details(self):
        """Fetches employee info and company abbreviation in one flow."""
        
        # 1. Guard Clause: If no employee, reset fields and stop
        if not self.employee:
            self.reset_employee_fields()
            return

        # 2. Fetch Employee Data
        fields = ["employee_name", "department", "company"]
        emp_data = frappe.db.get_value("Employee", self.employee, fields, as_dict=True)

        if not emp_data:
            frappe.throw(f"Employee {self.employee} not found in the system.")

        # 3. Set Employee Values
        self.employee_name = emp_data.employee_name or ""
        self.department    = emp_data.department or ""
        self.company       = emp_data.company or ""

        # 4. Fetch and Set Company Abbreviation
        if self.company:
            self.abbr = frappe.db.get_value("Company", self.company, "abbr") or ""

    def reset_employee_fields(self):
        """Clears all dependent fields."""
        self.employee_name = ""
        self.department    = ""
        self.company       = ""
        self.abbr          = ""