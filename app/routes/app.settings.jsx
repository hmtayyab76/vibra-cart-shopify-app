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
  let settings = await db.settings.findMany();
  console.log("settings ------>", settings);

  // Format the settings data for the DataTable
  const rows = settings.map(setting => [
    setting.name, 
    setting.description, 
    setting.id,
  { id: setting.id }
  ]);

  return json({ settings, rows });
}

export async function action({ request }) {
  let formData = await request.formData();
  let settings = Object.fromEntries(formData);

  if (settings.deleteId) {
    // If the deleteId field exists in the form data, delete the record with that ID
    await db.settings.delete({
      where: {
        id: parseInt(settings.deleteId), // Assuming ID is an integer
      },
    });

    // Provide feedback to the user
    return json({ message: "Record deleted successfully" });
  } else {
    // If deleteId field doesn't exist, it means the user submitted the form to update settings
    await db.settings.create({
      data: {
        name: settings.name,
        description: settings.description,
      },
    });
    return json(settings);
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
export default function AdditionalPage() {
  let settings = useLoaderData();
  let { rows } = useLoaderData();
  const [formState, setFormState] = useState(settings);
  const [deleteId, setDeleteId] = useState('');

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
  const dataTableRows = rows.map(row => [
    row[2],  // ID
    row[0],  // Product Name
    row[1],  // Description
    <DeleteButton key={row[2]} id={row[2]} />  // Delete Button
  ]);

  return (
    <>

    
    <Page 
      divider
      primaryAction={{ content: "View on your store", disabled: true }}
      secondaryActions={[
        {
          content: "Duplicate",
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Duplicate action"),
        },
      ]}
    >
      <TitleBar title="App Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "1fr 2fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update App settings and preferences
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST" onSubmit={handleSubmit}>
              <BlockStack gap="400">
                <TextField 
                  label="Product Name"
                  name="name" 
                  value={formState?.name} 
                  onChange={(value) => setFormState({ ...formState, name: value })} 
                />
                
                <TextField 
                  label="Description" 
                  name="description"
                  value={formState?.description} 
                  onChange={(value) => setFormState({ ...formState, description: value })} 
                />
                <Button submit={true}>Add Product</Button>
              </BlockStack>
            </Form>
             
        
          
          </Card>
         
        </InlineGrid>
      </BlockStack>
    
     
    </Page>
    <Page 
    >
      <TitleBar title="App Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 2fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Delete Product
              </Text>
              <Text as="p" variant="bodyMd">
                Update App settings and preferences
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
          <Form method="POST" onSubmit={handleSubmit}>
              <BlockStack gap="400">
                <TextField 
                  label="Product ID" 
                  name="deleteId"
                  value={deleteId} 
                  onChange={(value) => setDeleteId(value)} 
                />
                <Button submit={true}>Delete Product</Button>
              </BlockStack>
            </Form>
             
        
          
          </Card>
         
        </InlineGrid>
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
              'text'
            ]}
            headings={[
              'ID',
              'Product',
              'Description',
              'Actions'
            ]}
            rows={dataTableRows}
            // Optionally, you can add totals if needed
            // totals={['', '', '', '', '$155,830.00']}
            // totalsName={{
            //   singular: 'Total net sales',
            //   plural: 'Total net sales',
            // }}
           
          />
        </LegacyCard>
      </Page>

    </>
  );
}
