import {
    Box,
    Card,
    Page,
    Text,
    BlockStack,
    InlineGrid,
    TextField,
    Button,
    DataTable,
    LegacyCard

} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, Form, useFetcher } from "@remix-run/react";
import db from '../db.server'

export async function loader() {
    let students = await db.student.findMany();
    console.log("students ------>", students);

    // Format the student data for the DataTable
    const rows = students.map(student => [
        student.firstName,
        student.lastName,
        student.email,
        student.age,
        student.grade,
        student.address,
        student.city,
        student.state,
        student.zipCode,
        student.phoneNumber,
        student.id,
        { id: student.id }
    ]);

    return json({ students, rows });
}


export async function action({ request }) {
    let formData = await request.formData();
    let studentData = Object.fromEntries(formData);

    if (studentData.deleteId) {
        // If the deleteId field exists in the form data, delete the student record with that ID
        await db.student.delete({
            where: {
                id: parseInt(studentData.deleteId), // Assuming ID is an integer
            },
        });

        // Provide feedback to the user
        return json({ message: "Record deleted successfully" });
    } else {
        // If deleteId field doesn't exist, it means the user submitted the form to add a new student record
        await db.student.create({
            data: {
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                email: studentData.email,
                age: parseInt(studentData.age),
                grade: studentData.grade,
                address: studentData.address,
                city: studentData.city,
                state: studentData.state,
                zipCode: studentData.zipCode,
                phoneNumber: studentData.phoneNumber,
            },
        });
        return json(studentData);
    }
}
function DeleteButton({ id }) {
    const fetcher = useFetcher();

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            fetcher.submit({ deleteId: id }, { method: "post" });
        }
    };

    return (
        <Button onClick={handleDelete}>Delete</Button>
    );
}


export default function StudentRecord() {
    let settings = useLoaderData();
  let { rows } = useLoaderData();
  const [formState, setFormState] = useState(settings);
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
    
        const response = await fetch(form.action, {
          method: form.method,
          body: formData,
        });
    
        if (response.ok) {
          // If response is successful, show an alert
          alert("Action successful!");
          window.location.reload();
        } else {
          // If response fails, show an alert
          alert("Action failed!");
        }
      };

    // Map the rows to include DeleteButton component for each row
    const dataTableRows = rows.map(row => [
        row[0],  // ID
        row[1],  // First Name
        row[2],  // Last Name
        row[3],  // Email
        row[4],  // Age
        row[5],  // Grade
        row[6],  // Address
        row[7],  // City
        row[8],  // State
        row[9],  // Zip Code
        row[10], // Phone Number
        <DeleteButton key={row[11]} id={row[11]} />  // Delete Button
    ]);
    return (
        <>
             <Page title="Add Student Record">
      <TitleBar title="App Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <Card roundedAbove="sm">
          <Form method="POST" onSubmit={handleSubmit}>
            <BlockStack gap="400">
              <InlineGrid columns={{ xs: "1fr", md: "2fr 2fr" }} gap="400">
                <TextField
                  label="First Name"
                  name="firstName"
                  value={formState.firstName}
                  onChange={(value) => setFormState({ ...formState, firstName: value })}
                />
                <TextField
                  label="Last Name"
                  name="lastName"
                  value={formState.lastName}
                  onChange={(value) => setFormState({ ...formState, lastName: value })}
                />
              </InlineGrid>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 2fr" }} gap="400">
                <TextField
                  label="Email"
                  name="email"
                  value={formState.email}
                  onChange={(value) => setFormState({ ...formState, email: value })}
                />
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={formState.age}
                  onChange={(value) => setFormState({ ...formState, age: value })}
                />
              </InlineGrid>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 2fr" }} gap="400">
                <TextField
                  label="Grade"
                  name="grade"
                  value={formState.grade}
                  onChange={(value) => setFormState({ ...formState, grade: value })}
                />
                <TextField
                  label="Address"
                  name="address"
                  value={formState.address}
                  onChange={(value) => setFormState({ ...formState, address: value })}
                />
              </InlineGrid>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 2fr" }} gap="400">
                <TextField
                  label="City"
                  name="city"
                  value={formState.city}
                  onChange={(value) => setFormState({ ...formState, city: value })}
                />
                <TextField
                  label="State"
                  name="state"
                  value={formState.state}
                  onChange={(value) => setFormState({ ...formState, state: value })}
                />
              </InlineGrid>
              <InlineGrid columns={{ xs: "1fr", md: "2fr 2fr" }} gap="400">
                <TextField
                  label="Zip Code"
                  name="zipCode"
                  value={formState.zipCode}
                  onChange={(value) => setFormState({ ...formState, zipCode: value })}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={(value) => setFormState({ ...formState, phoneNumber: value })}
                />
              </InlineGrid>
              <Button submit={true}>Add Student</Button>
            </BlockStack>
          </Form>
        </Card>
      </BlockStack>
    </Page>
        
            <Page title="Product Records">
            <LegacyCard>
        <DataTable
            showTotalsInFooter
            columnContentTypes={[
                'numeric',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text',
                'text' // For delete button
            ]}
            headings={[
                'ID',
                'First Name',
                'Last Name',
                'Email',
                'Age',
                'Grade',
                'Address',
                'City',
                'State',
                'Zip Code',
                'Phone Number',
                'Actions' // For delete button
            ]}
            rows={dataTableRows}
        />
    </LegacyCard>
            </Page>

        </>
    );
}
