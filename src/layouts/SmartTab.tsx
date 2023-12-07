import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

export default function SmartTab({ tabs }: any) {
  return (
    <div className="flex w-full flex-col">
      <Tabs aria-label="Options">
        {tabs?.map((tab:any) => (
          <Tab key={tab.name} title={tab.name}>
            <Card>
              <CardBody>{tab.content}</CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
