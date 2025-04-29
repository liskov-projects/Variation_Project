import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    lineHeight: 1.6,
  },
  heading: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: 'bold',
    textDecoration: 'underline',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: '35%',
    fontWeight: 'bold',
  },
  value: {
    width: '65%',
  },
});

const VariationPDF = ({ project, variation }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Variation Report</Text>

      {/* Section: Project Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Project Name:</Text>
          <Text style={styles.value}>{project?.projectName || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Property Address:</Text>
          <Text style={styles.value}>{project?.propertyAddress || 'N/A'}</Text>
        </View>
      </View>

      {/* Section: Variation Overview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Variation Overview</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{variation.status || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Date Created:</Text>
          <Text style={styles.value}>{new Date(variation.dateCreated).toLocaleDateString() || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Permit Required:</Text>
          <Text style={styles.value}>{variation.permitVariation || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Timeline Delay:</Text>
          <Text style={styles.value}>{variation.delay || 'N/A'}</Text>
        </View>
      </View>

      {/* Section: Description & Reason */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Description:</Text>
          <Text style={styles.value}>{variation.description || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Reason:</Text>
          <Text style={styles.value}>{variation.reason || 'N/A'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Effect on Project:</Text>
          <Text style={styles.value}>{variation.effect || 'N/A'}</Text>
        </View>
      </View>

      {/* Section: Financial Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Summary</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Variation Cost:</Text>
          <Text style={styles.value}>${variation.cost?.toLocaleString() || '0'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>New Contract Price:</Text>
          <Text style={styles.value}>${variation.newContractPrice?.toLocaleString() || '0'}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default VariationPDF;
