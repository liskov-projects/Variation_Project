import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  companyInfo: {
    width: "50%",
  },
  rightHeader: {
    alignItems: "flex-end",
    width: "50%",
  },
  bold: { fontWeight: "bold" },
  titleBox: {
    border: "1pt solid black",
    padding: 10,
    marginBottom: 15,
    textAlign: "center",
  },
  section: {
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "35%",
    fontWeight: "bold",
  },
  value: {
    width: "65%",
  },
  tableHeader: {
    flexDirection: "row",
    borderTop: "1pt solid black",
    borderBottom: "1pt solid black",
    paddingVertical: 4,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottom: "0.5pt solid grey",
  },
  itemCol: { width: "10%" },
  descCol: { width: "65%" },
  priceCol: { width: "25%", textAlign: "right" },
  totals: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalLabel: { width: "60%", textAlign: "right", fontWeight: "bold" },
  totalValue: { width: "30%", textAlign: "right" },
  signature: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signLine: {
    marginTop: 20,
    borderTop: "1pt solid black",
    width: "40%",
    textAlign: "center",
    fontSize: 10,
  },
  footer: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 10,
  },
});

const VariationPDF = ({ project, variation, profile}) => {
  const parsedCost = parseFloat(variation?.cost?.toString().replace(/,/g, "")) || 0;
  const projectedPrice = (variation?.cost)+(project.contractPrice)
  const renderBuilderDetails = () => {
    if (profile?.company === "Yes") {
      return (
        <>
          <Text style={styles.bold}>Builder Type: Company</Text>
          <Text>Company Name: {profile.companyDetails?.companyName || "N/A"}</Text>
          <Text>ACN: {profile.companyDetails?.acn || "N/A"}</Text>
        </>
      );
    }

    if (profile?.partnership === "Yes") {
      return (
        <>
          <Text style={styles.bold}>Builder Type: Partnership</Text>
          <Text>Number of Partners: {profile?.numberOfPartners || "N/A"}</Text>
          {profile.partners?.map((p, i) => (
            <Text key={i}>Partner {i + 1}: {p.name || "Unnamed"}</Text>
          ))}
        </>
      );
    }

    return (
      <>
        <Text style={styles.bold}>Builder Type: Individual</Text>
        <Text>ABN: {profile?.abn || "N/A"}</Text>
        <Text>BRN: {profile?.brn || "N/A"}</Text>
      </>
    );
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.companyInfo}>
            <Text style={styles.bold}>{profile?.fullName || "Builder"}</Text>
            <Text>{profile?.address || "N/A"}</Text>
            <Text>Email: {profile?.email || "N/A"}</Text>
            <Text>Phone: {profile?.phoneNumber || "N/A"}</Text>
            <View style={{ marginTop: 6 }}>{renderBuilderDetails()}</View>
          </View>

          <View style={styles.rightHeader}>
            <Text>{new Date(variation.dateCreated).toLocaleDateString()}</Text>
            {project?.contractPrice && (
              <Text>Original Contract: ${project.contractPrice.toLocaleString()}</Text>
            )}
            {project?.currentContractPrice && (
              <Text>Current Total: ${project.currentContractPrice.toLocaleString()}</Text>
            )}
            {projectedPrice && (
              <Text>Projected Total: ${projectedPrice.toLocaleString()}</Text>
            )}
          </View>
        </View>

        {/* Title Box */}
        <View style={styles.titleBox}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>Quotation for Variation</Text>
        </View>

        {/* Site Info */}
        <View style={styles.section}>
          <Text>Project: {project?.projectName || "N/A"}</Text>
          <Text>Address: {project?.propertyAddress || "N/A"}</Text>
          <Text>Status: {variation?.status || "Draft"}</Text>
        </View>

        {/* Table */}
        <View style={styles.tableHeader}>
          <Text style={styles.itemCol}>#</Text>
          <Text style={styles.descCol}>Description</Text>
          <Text style={styles.priceCol}>Price</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.itemCol}>1</Text>
          <Text style={styles.descCol}>{variation?.description || "N/A"}</Text>
          <Text style={styles.priceCol}>${parsedCost.toLocaleString()}</Text>
        </View>

        {/* Totals */}
        <View style={styles.totals}>
          <Text style={styles.totalLabel}>Sub-total:</Text>
          <Text style={styles.totalValue}>${parsedCost.toLocaleString()}</Text>
        </View>
        <View style={styles.totals}>
          <Text style={styles.totalLabel}>GST (0%):</Text>
          <Text style={styles.totalValue}>$0.00</Text>
        </View>
        <View style={styles.totals}>
          <Text style={styles.totalLabel}>Quotation Total:</Text>
          <Text style={styles.totalValue}>${parsedCost.toLocaleString()}</Text>
        </View>

        {/* Details */}
        <View style={styles.section}>
          <Text style={{ marginTop: 12, fontWeight: "bold" }}>Reason for Variation:</Text>
          <Text>{variation?.reason || "N/A"}</Text>
          <Text style={{ marginTop: 8, fontWeight: "bold" }}>Effect on Project:</Text>
          <Text>{variation?.effect || "N/A"}</Text>
          <Text style={{ marginTop: 8, fontWeight: "bold" }}>Permit Required:</Text>
          <Text>{variation?.permitVariation || "N/A"}</Text>
          <Text style={{ marginTop: 8, fontWeight: "bold" }}>Timeline Delay:</Text>
          <Text>{variation?.delay || 0} days</Text>
        </View>

       {/* Signatures */}
        <View style={[styles.signature, { justifyContent: "flex-end" }]}>
          <View style={{ alignItems: "flex-end" }}>
            <Text>Date: ____/____/______</Text>
            <View style={{ alignItems: "center", marginTop: 20 }}>
              <View style={{ borderTop: "1pt solid black", width: 150 }} />
              <Text style={{ fontSize: 10, marginTop: 4 }}>Client Signature</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>Please sign and return to proceed with this variation.</Text>
      </Page>
    </Document>
  );
};

export default VariationPDF;
