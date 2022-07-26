import { useState, useEffect } from "react";
import { Box, Flex, Icon, Breadcrumb, Link, Text, SeparatorVertical } from "brainly-style-guide";

import type { ReportDataInModerationTicket } from "@typings/";
import GetUserProfile, { UserDataInProfileType } from "@api/Brainly/GetUserProfile";

import DateTime from "@styleguide/DateTime";
import ReportIconWithText from "./ReportIconWithText";

export default function ReportSection(props: {
  report: ReportDataInModerationTicket
}) {
  const report = props.report;
  const reporter = props.report.user;

  const [reporterData, setReporterData] = useState<UserDataInProfileType>(null);

  useEffect(() => {
    GetUserProfile(reporter.id).then(user => setReporterData(user));
  }, []);

  return (
    <Box border className="moderation-ticket-report" padding="xs">
      <Flex>
        <Icon type="report_flag" color="icon-red-50" size={32} />
        <Flex direction="column">
          <Breadcrumb elements={[
            <Link size="small" target="_blank" href={reporter.profileLink}>
              {reporter.nick}
            </Link>,
            <Text type="span" size="small" style={{ color: reporter.rankColor }}>
              {reporter.ranks.join(", ")}
            </Text>,
            reporterData && <Text size="xsmall">{locales.warnShort}: {reporterData.warnsCount}</Text>
          ]} />
          <Text weight="bold" size="small">{report.abuseName}</Text>
          {!!report.abuseDetails && 
            <Text size="small" color="text-gray-70">{report.abuseDetails}</Text>
          }
        </Flex>
        <Text size="xsmall" color="text-gray-70">
          <DateTime date={report.date} fromNow />
        </Text>
        <Flex className="reporter-extra-data">
          {reporterData && <>
            <SeparatorVertical />
            <ReportIconWithText 
              text={reporterData.reportsCount} 
              iconColor="icon-black" 
              title={locales.numberOfAllReports}
            />
            <ReportIconWithText 
              text={reporterData.reportsCount} 
              iconColor="icon-red-50"
              title={locales.numberOfWrongReports}
            />
            <ReportIconWithText 
              text={`${reporterData.correctReportsPercent}%`} 
              iconColor="icon-green-50"
              title={locales.percentOfCorrectReports}
            />
          </>}
        </Flex>
      </Flex>
    </Box>
  );
}