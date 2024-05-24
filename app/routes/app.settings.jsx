import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useState } from "react";
import { json } from "@remix-run/node"; 
import { useLoaderData, Form } from "@remix-run/react";

export async function loader() {
  let settings = {
    name: "My App",
    description: "My App Description"
  };
  return json(settings);
}

export async function action({ request }) {
  let formData = await request.formData();
  let settings = Object.fromEntries(formData);

  // Here you would typically update your database or persistent storage with the new settings
  return json(settings);
}

export default function AdditionalPage() {
  let settings = useLoaderData();
  const [formState, setFormState] = useState(settings);

  return (
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
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
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
            <Form method="POST">
              <BlockStack gap="400">
                <TextField 
                  label="App Name"
                  name="name" 
                  value={formState.name} 
                  onChange={(value) => setFormState({ ...formState, name: value })} 
                />
                <TextField 
                  label="Description" 
                  name="description"
                  value={formState.description} 
                  onChange={(value) => setFormState({ ...formState, description: value })} 
                />
                <Button submit={true}>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
