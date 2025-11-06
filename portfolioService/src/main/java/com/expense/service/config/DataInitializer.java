package com.expense.service.config;

import com.expense.service.entities.CryptoHolding;
import com.expense.service.entities.ManualHolding;
import com.expense.service.entities.MutualFundHolding;
import com.expense.service.entities.StockHolding;
import com.expense.service.repository.CryptoHoldingRepository;
import com.expense.service.repository.ManualHoldingRepository;
import com.expense.service.repository.MutualFundHoldingRepository;
import com.expense.service.repository.StockHoldingRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Date;

@Component
@Profile("!test")
@Slf4j
public class DataInitializer implements CommandLineRunner {

    // The fixed UUID for the 'admin' user from your authservice
    private static final String ADMIN_USER_ID = "550e8400-e29b-41d4-a716-446655440000";

    @Autowired
    private StockHoldingRepository stockHoldingRepository;
    @Autowired
    private CryptoHoldingRepository cryptoHoldingRepository;
    @Autowired
    private MutualFundHoldingRepository mutualFundHoldingRepository;
    @Autowired
    private ManualHoldingRepository manualHoldingRepository;

    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists for this user to avoid duplicates
        if (stockHoldingRepository.findByUserId(ADMIN_USER_ID).isEmpty()) {
            log.info("No data found for admin user. Seeding dummy data...");

            // 1. Stock Holdings
            StockHolding aapl = new StockHolding();
            aapl.setUserId(ADMIN_USER_ID);
            aapl.setSymbol("AAPL");
            aapl.setExchange("NASDAQ");
            aapl.setQuantity(new BigDecimal("10.0"));
            aapl.setPurchasePrice(new BigDecimal("150.00"));
            aapl.setPurchaseDate(new Date());
            stockHoldingRepository.save(aapl);

            StockHolding tsla = new StockHolding();
            tsla.setUserId(ADMIN_USER_ID);
            tsla.setSymbol("TSLA");
            tsla.setExchange("NASDAQ");
            tsla.setQuantity(new BigDecimal("5.0"));
            tsla.setPurchasePrice(new BigDecimal("200.00"));
            tsla.setPurchaseDate(new Date());
            stockHoldingRepository.save(tsla);

            // 2. Crypto Holding
            CryptoHolding btc = new CryptoHolding();
            btc.setUserId(ADMIN_USER_ID);
            btc.setCoinId("bitcoin"); // For CoinGecko API
            btc.setSymbol("BTC");
            btc.setQuantity(new BigDecimal("0.5"));
            btc.setPurchasePrice(new BigDecimal("30000.00"));
            btc.setPurchaseDate(new Date());
            cryptoHoldingRepository.save(btc);

            // 3. Mutual Fund Holding
            MutualFundHolding mf = new MutualFundHolding();
            mf.setUserId(ADMIN_USER_ID);
            mf.setSchemeCode("120503"); // Example: Axis Bluechip
            mf.setQuantity(new BigDecimal("100.0"));
            mf.setPurchasePrice(new BigDecimal("20.00"));
            mf.setPurchaseDate(new Date());
            mutualFundHoldingRepository.save(mf);

            // 4. Manual Holdings (for Gold and Real Estate cards)
            ManualHolding gold = new ManualHolding();
            gold.setUserId(ADMIN_USER_ID);
            gold.setAssetName("Physical Gold");
            gold.setAssetType("Gold"); // Used to filter for the 'Gold' card
            gold.setInvestedValue(new BigDecimal("250000.00")); // 50g * 5000
            gold.setCurrentValue(new BigDecimal("300000.00")); // Example current value
            gold.setPurchaseDate(new Date());
            manualHoldingRepository.save(gold);
            
            ManualHolding re = new ManualHolding();
            re.setUserId(ADMIN_USER_ID);
            re.setAssetName("Real Estate Plot");
            re.setAssetType("Real Estate"); // Used to filter for the 'Real Estate' card
            re.setInvestedValue(new BigDecimal("500000.00"));
            re.setCurrentValue(new BigDecimal("550000.00")); // Example current value
            re.setPurchaseDate(new Date());
            manualHoldingRepository.save(re);

            log.info("Dummy data seeding complete for user: " + ADMIN_USER_ID);
        } else {
            log.info("Data for admin user already exists. Skipping data seeding.");
        }
    }
}
