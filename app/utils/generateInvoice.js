// app/utils/generateInvoice.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ==========================================
// GENERATE PDF INVOICE
// ==========================================
export const generateInvoicePDF = (order) => {
  const doc = new jsPDF();
  
  // ===== COMPANY LOGO & HEADER =====
  doc.setFillColor(43, 122, 75); // Green background
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('GreenScape', 14, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Grow. Nurture. Thrive.', 14, 28);
  
  doc.setFontSize(12);
  doc.text('INVOICE', 196, 20, { align: 'right' });
  doc.setFontSize(8);
  doc.text('Invoice #: ' + order.orderNumber, 196, 28, { align: 'right' });
  doc.text('Date: ' + new Date(order.createdAt).toLocaleDateString(), 196, 34, { align: 'right' });
  
  // ===== BILL TO / SHIP TO SECTION =====
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 14, 50);
  doc.text('Ship To:', 110, 50);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  // Bill To (Customer)
  const customerName = order.user?.firstName 
    ? `${order.user.firstName} ${order.user.lastName || ''}`.trim() 
    : order.customerName || 'Customer';
  const customerEmail = order.user?.email || order.shippingAddress?.email || '';
  const customerPhone = order.user?.phone || order.shippingAddress?.phone || '';
  
  doc.text(customerName, 14, 58);
  doc.text(customerEmail, 14, 64);
  doc.text(customerPhone, 14, 70);
  
  // Ship To (Address)
  const shipAddress = order.shippingAddress;
  if (shipAddress) {
    doc.text(shipAddress.firstName + ' ' + shipAddress.lastName, 110, 58);
    doc.text(shipAddress.address, 110, 64);
    doc.text(shipAddress.city + ', ' + shipAddress.state + ' ' + shipAddress.zip, 110, 70);
    doc.text(shipAddress.country, 110, 76);
  }
  
  // ===== ORDER DETAILS TABLE =====
  autoTable(doc, {
    startY: 90,
    head: [['Product', 'Qty', 'Price', 'Total']],
    body: order.items?.map(item => {
      const productName = item.product?.name || item.name || 'Product';
      const quantity = item.quantity || 1;
      const price = item.price || 0;
      const total = price * quantity;
      
      return [
        productName,
        quantity.toString(),
        `Rs. ${price.toFixed(2)}`,
        `Rs. ${total.toFixed(2)}`
      ];
    }) || [],
    theme: 'grid',
    headStyles: {
      fillColor: [43, 122, 75],
      textColor: 255,
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 30, halign: 'center' },
      2: { cellWidth: 40, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' }
    }
  });
  
  // ===== SUMMARY SECTION =====
  const finalY = doc.lastAutoTable.finalY + 20;
  
  const summaryItems = [
    { label: 'Subtotal', amount: order.subtotal || order.totalAmount },
    { label: 'Delivery', amount: order.deliveryCharge || 0 },
    { label: 'Tax', amount: order.tax || 0 },
  ];
  
  // Add summary rows
  let currentY = finalY;
  
  summaryItems.forEach(item => {
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(item.label, 140, currentY);
    doc.text(`Rs. ${item.amount.toFixed(2)}`, 196, currentY, { align: 'right' });
    currentY += 7;
  });
  
  // Total
  currentY += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(43, 122, 75);
  doc.text('Total:', 140, currentY);
  doc.text(`Rs. ${order.totalAmount.toFixed(2)}`, 196, currentY, { align: 'right' });
  
  // ===== FOOTER =====
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, 280, 196, 280);
  
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for shopping with GreenScape!', 105, 285, { align: 'center' });
  doc.text('If you have any questions, please contact us at support@greenscape.com', 105, 290, { align: 'center' });
  doc.text('© 2026 GreenScape. All rights reserved.', 105, 295, { align: 'center' });
  
  // ===== SAVE PDF =====
  doc.save(`Invoice-${order.orderNumber || order._id}.pdf`);
};