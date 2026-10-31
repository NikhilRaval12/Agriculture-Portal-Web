package com.agriculture.portal.repository;

import com.agriculture.portal.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomerId(Long customerId);
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByInvoiceNumber(String invoiceNumber);
}
