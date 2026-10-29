#!/usr/bin/env python3
"""
Generate native Tableau Workbook (.twb) and Packaged Workbook (.twbx)
for Retail Sales & Customer Analytics.
"""

import os
import zipfile

def generate_tableau_workbook():
    twb_content = """<?xml version='1.0' encoding='utf-8' ?>
<workbook source-build='2024.1.0 (20241.24.0115.1114)' version='18.1' xmlns:user='http://www.tableausoftware.com/xml/user'>
  <document-format-change-manifest>
    <AccessibleZoneTabOrder />
    <AutoCreateAndUpdateDBCrossFilterAction />
    <MapboxVectorStylesAndLayers />
    <SheetIdentifierTracking />
    <WindowsPersistSimpleIdentifiers />
  </document-format-change-manifest>
  <preferences>
    <preference name='ui.encoding.shelf.height' value='24' />
    <preference name='ui.shelf.height' value='26' />
  </preferences>
  <style-theme name='smooth' />
  <datasources>
    <datasource caption='tableau_sales_master' inline='true' name='federated.sales_data' version='18.1'>
      <connection class='federated'>
        <named-connections>
          <named-connection caption='tableau_sales_master' name='textscan.sales_conn'>
            <connection class='textscan' directory='.' filename='tableau_sales_master.csv' />
          </named-connection>
        </named-connections>
        <relation connection='textscan.sales_conn' name='tableau_sales_master#csv' table='[tableau_sales_master#csv]' type='table'>
          <columns character-set='UTF-8' header='yes' locale='en_US'>
            <column datatype='integer' name='order_id' ordinal='0' />
            <column datatype='date' name='order_date' ordinal='1' />
            <column datatype='integer' name='order_year' ordinal='2' />
            <column datatype='integer' name='order_month' ordinal='3' />
            <column datatype='string' name='order_month_name' ordinal='4' />
            <column datatype='string' name='order_year_month' ordinal='5' />
            <column datatype='string' name='order_status' ordinal='6' />
            <column datatype='string' name='region' ordinal='7' />
            <column datatype='integer' name='customer_id' ordinal='8' />
            <column datatype='string' name='customer_name' ordinal='9' />
            <column datatype='string' name='city' ordinal='10' />
            <column datatype='integer' name='product_id' ordinal='11' />
            <column datatype='string' name='product_name' ordinal='12' />
            <column datatype='string' name='category' ordinal='13' />
            <column datatype='integer' name='quantity' ordinal='14' />
            <column datatype='real' name='unit_price' ordinal='15' />
            <column datatype='real' name='discount_percent' ordinal='16' />
            <column datatype='real' name='gross_amount' ordinal='17' />
            <column datatype='real' name='discount_amount' ordinal='18' />
            <column datatype='real' name='net_revenue' ordinal='19' />
            <column datatype='real' name='total_cost' ordinal='20' />
            <column datatype='real' name='profit' ordinal='21' />
            <column datatype='real' name='profit_margin_pct' ordinal='22' />
          </columns>
        </relation>
        <metadata-records>
          <metadata-record class='column'>
            <remote-name>order_id</remote-name>
            <remote-type>20</remote-type>
            <local-name>[order_id]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>order_id</remote-alias>
            <ordinal>0</ordinal>
            <local-type>integer</local-type>
            <aggregation>Sum</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>order_date</remote-name>
            <remote-type>133</remote-type>
            <local-name>[order_date]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>order_date</remote-alias>
            <ordinal>1</ordinal>
            <local-type>date</local-type>
            <aggregation>Year</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>order_year_month</remote-name>
            <remote-type>129</remote-type>
            <local-name>[order_year_month]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>order_year_month</remote-alias>
            <ordinal>5</ordinal>
            <local-type>string</local-type>
            <aggregation>Count</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>order_status</remote-name>
            <remote-type>129</remote-type>
            <local-name>[order_status]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>order_status</remote-alias>
            <ordinal>6</ordinal>
            <local-type>string</local-type>
            <aggregation>Count</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>region</remote-name>
            <remote-type>129</remote-type>
            <local-name>[region]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>region</remote-alias>
            <ordinal>7</ordinal>
            <local-type>string</local-type>
            <aggregation>Count</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>customer_name</remote-name>
            <remote-type>129</remote-type>
            <local-name>[customer_name]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>customer_name</remote-alias>
            <ordinal>9</ordinal>
            <local-type>string</local-type>
            <aggregation>Count</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>category</remote-name>
            <remote-type>129</remote-type>
            <local-name>[category]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>category</remote-alias>
            <ordinal>13</ordinal>
            <local-type>string</local-type>
            <aggregation>Count</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>quantity</remote-name>
            <remote-type>20</remote-type>
            <local-name>[quantity]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>quantity</remote-alias>
            <ordinal>14</ordinal>
            <local-type>integer</local-type>
            <aggregation>Sum</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>net_revenue</remote-name>
            <remote-type>5</remote-type>
            <local-name>[net_revenue]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>net_revenue</remote-alias>
            <ordinal>19</ordinal>
            <local-type>real</local-type>
            <aggregation>Sum</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>profit</remote-name>
            <remote-type>5</remote-type>
            <local-name>[profit]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>profit</remote-alias>
            <ordinal>21</ordinal>
            <local-type>real</local-type>
            <aggregation>Sum</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
          <metadata-record class='column'>
            <remote-name>profit_margin_pct</remote-name>
            <remote-type>5</remote-type>
            <local-name>[profit_margin_pct]</local-name>
            <parent-name>[tableau_sales_master#csv]</parent-name>
            <remote-alias>profit_margin_pct</remote-alias>
            <ordinal>22</ordinal>
            <local-type>real</local-type>
            <aggregation>Avg</aggregation>
            <contains-null>true</contains-null>
          </metadata-record>
        </metadata-records>
      </connection>
      <aliases enabled='yes' />
      <column caption='Order ID' datatype='integer' name='[order_id]' role='dimension' type='ordinal' />
      <column caption='Order Date' datatype='date' name='[order_date]' role='dimension' type='ordinal' />
      <column caption='Year-Month' datatype='string' name='[order_year_month]' role='dimension' type='nominal' />
      <column caption='Order Status' datatype='string' name='[order_status]' role='dimension' type='nominal' />
      <column caption='Region' datatype='string' name='[region]' role='dimension' type='nominal' />
      <column caption='Customer Name' datatype='string' name='[customer_name]' role='dimension' type='nominal' />
      <column caption='Category' datatype='string' name='[category]' role='dimension' type='nominal' />
      <column caption='Quantity Sold' datatype='integer' name='[quantity]' role='measure' type='quantitative' />
      <column caption='Net Revenue (INR)' datatype='real' default-format='C16393' name='[net_revenue]' role='measure' type='quantitative' />
      <column caption='Total Profit (INR)' datatype='real' default-format='C16393' name='[profit]' role='measure' type='quantitative' />
      <column caption='Profit Margin %' datatype='real' default-format='p0.00%' name='[profit_margin_pct]' role='measure' type='quantitative' />
      <layout dim-ordering='alphabetic' dim-percentage='0.5' measure-ordering='alphabetic' measure-percentage='0.5' show-structure='true' />
    </datasource>
  </datasources>

  <worksheets>
    <!-- Worksheet 1: Monthly Sales Trend -->
    <worksheet name='Monthly_Revenue_Trend'>
      <table>
        <view>
          <datasources>
            <datasource caption='tableau_sales_master' name='federated.sales_data' />
          </datasources>
          <datasource-dependencies datasource='federated.sales_data'>
            <column datatype='date' name='[order_date]' role='dimension' type='ordinal' />
            <column datatype='real' name='[net_revenue]' role='measure' type='quantitative' />
            <column datatype='real' name='[profit]' role='measure' type='quantitative' />
            <column datatype='string' name='[order_status]' role='dimension' type='nominal' />
            <column-instance column='[order_date]' derivation='Month-Trunc' name='[tmn:order_date:qk]' pivot='key' type='quantitative' />
            <column-instance column='[net_revenue]' derivation='Sum' name='[sum:net_revenue:qk]' pivot='key' type='quantitative' />
            <column-instance column='[profit]' derivation='Sum' name='[sum:profit:qk]' pivot='key' type='quantitative' />
          </datasource-dependencies>
          <filter class='categorical' column='[federated.sales_data].[order_status]'>
            <groupfilter function='except' user:ui-domain='database' user:ui-enumeration='inclusive' user:ui-marker='enumerate'>
              <groupfilter function='level-members' level='[order_status]' />
              <groupfilter function='member' member='&quot;Cancelled&quot;' />
            </groupfilter>
          </filter>
          <slices>
            <column>[federated.sales_data].[order_status]</column>
          </slices>
          <aggregation value='true' />
        </view>
        <style />
        <panes>
          <pane id='1' selection-relaxation-option='selection-relaxation-allow'>
            <view>
              <breakdown value='auto' />
            </view>
            <mark class='Bar' />
            <encodings>
              <color column='[federated.sales_data].[sum:net_revenue:qk]' />
            </encodings>
          </pane>
        </panes>
        <rows>[federated.sales_data].[sum:net_revenue:qk]</rows>
        <cols>[federated.sales_data].[tmn:order_date:qk]</cols>
      </table>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC01}' />
    </worksheet>

    <!-- Worksheet 2: Category Performance -->
    <worksheet name='Category_Performance'>
      <table>
        <view>
          <datasources>
            <datasource caption='tableau_sales_master' name='federated.sales_data' />
          </datasources>
          <datasource-dependencies datasource='federated.sales_data'>
            <column datatype='string' name='[category]' role='dimension' type='nominal' />
            <column datatype='real' name='[net_revenue]' role='measure' type='quantitative' />
            <column datatype='real' name='[profit]' role='measure' type='quantitative' />
            <column datatype='string' name='[order_status]' role='dimension' type='nominal' />
            <column-instance column='[category]' derivation='None' name='[none:category:nk]' pivot='key' type='nominal' />
            <column-instance column='[net_revenue]' derivation='Sum' name='[sum:net_revenue:qk]' pivot='key' type='quantitative' />
            <column-instance column='[profit]' derivation='Sum' name='[sum:profit:qk]' pivot='key' type='quantitative' />
          </datasource-dependencies>
          <filter class='categorical' column='[federated.sales_data].[order_status]'>
            <groupfilter function='except' user:ui-domain='database' user:ui-enumeration='inclusive' user:ui-marker='enumerate'>
              <groupfilter function='level-members' level='[order_status]' />
              <groupfilter function='member' member='&quot;Cancelled&quot;' />
            </groupfilter>
          </filter>
          <slices>
            <column>[federated.sales_data].[order_status]</column>
          </slices>
          <aggregation value='true' />
        </view>
        <style />
        <panes>
          <pane selection-relaxation-option='selection-relaxation-allow'>
            <view>
              <breakdown value='auto' />
            </view>
            <mark class='Bar' />
            <encodings>
              <color column='[federated.sales_data].[sum:profit:qk]' />
            </encodings>
          </pane>
        </panes>
        <rows>[federated.sales_data].[none:category:nk]</rows>
        <cols>[federated.sales_data].[sum:net_revenue:qk]</cols>
      </table>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC02}' />
    </worksheet>

    <!-- Worksheet 3: Regional Sales -->
    <worksheet name='Regional_Sales_Distribution'>
      <table>
        <view>
          <datasources>
            <datasource caption='tableau_sales_master' name='federated.sales_data' />
          </datasources>
          <datasource-dependencies datasource='federated.sales_data'>
            <column datatype='string' name='[region]' role='dimension' type='nominal' />
            <column datatype='real' name='[net_revenue]' role='measure' type='quantitative' />
            <column datatype='string' name='[order_status]' role='dimension' type='nominal' />
            <column-instance column='[region]' derivation='None' name='[none:region:nk]' pivot='key' type='nominal' />
            <column-instance column='[net_revenue]' derivation='Sum' name='[sum:net_revenue:qk]' pivot='key' type='quantitative' />
          </datasource-dependencies>
          <filter class='categorical' column='[federated.sales_data].[order_status]'>
            <groupfilter function='except' user:ui-domain='database' user:ui-enumeration='inclusive' user:ui-marker='enumerate'>
              <groupfilter function='level-members' level='[order_status]' />
              <groupfilter function='member' member='&quot;Cancelled&quot;' />
            </groupfilter>
          </filter>
          <slices>
            <column>[federated.sales_data].[order_status]</column>
          </slices>
          <aggregation value='true' />
        </view>
        <style />
        <panes>
          <pane selection-relaxation-option='selection-relaxation-allow'>
            <view>
              <breakdown value='auto' />
            </view>
            <mark class='Bar' />
            <encodings>
              <color column='[federated.sales_data].[none:region:nk]' />
            </encodings>
          </pane>
        </panes>
        <rows>[federated.sales_data].[none:region:nk]</rows>
        <cols>[federated.sales_data].[sum:net_revenue:qk]</cols>
      </table>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC03}' />
    </worksheet>

    <!-- Worksheet 4: Top Customers -->
    <worksheet name='Top_Customer_Spenders'>
      <table>
        <view>
          <datasources>
            <datasource caption='tableau_sales_master' name='federated.sales_data' />
          </datasources>
          <datasource-dependencies datasource='federated.sales_data'>
            <column datatype='string' name='[customer_name]' role='dimension' type='nominal' />
            <column datatype='real' name='[net_revenue]' role='measure' type='quantitative' />
            <column datatype='string' name='[order_status]' role='dimension' type='nominal' />
            <column-instance column='[customer_name]' derivation='None' name='[none:customer_name:nk]' pivot='key' type='nominal' />
            <column-instance column='[net_revenue]' derivation='Sum' name='[sum:net_revenue:qk]' pivot='key' type='quantitative' />
          </datasource-dependencies>
          <filter class='categorical' column='[federated.sales_data].[order_status]'>
            <groupfilter function='except' user:ui-domain='database' user:ui-enumeration='inclusive' user:ui-marker='enumerate'>
              <groupfilter function='level-members' level='[order_status]' />
              <groupfilter function='member' member='&quot;Cancelled&quot;' />
            </groupfilter>
          </filter>
          <slices>
            <column>[federated.sales_data].[order_status]</column>
          </slices>
          <aggregation value='true' />
        </view>
        <style />
        <panes>
          <pane selection-relaxation-option='selection-relaxation-allow'>
            <view>
              <breakdown value='auto' />
            </view>
            <mark class='Bar' />
            <encodings>
              <color column='[federated.sales_data].[sum:net_revenue:qk]' />
            </encodings>
          </pane>
        </panes>
        <rows>[federated.sales_data].[none:customer_name:nk]</rows>
        <cols>[federated.sales_data].[sum:net_revenue:qk]</cols>
      </table>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC04}' />
    </worksheet>
  </worksheets>

  <dashboards>
    <dashboard name='Retail_Sales_Executive_Dashboard'>
      <style />
      <size maxheight='850' maxwidth='1280' minheight='850' minwidth='1280' sizing-mode='fixed' />
      <zones>
        <zone h='100000' id='4' type-v2='layout-basic' w='100000' x='0' y='0'>
          <zone h='98000' id='5' param='horz' type-v2='layout-flow' w='98000' x='1000' y='1000'>
            <zone h='98000' id='6' param='vert' type-v2='layout-flow' w='49000' x='1000' y='1000'>
              <zone h='49000' id='7' name='Monthly_Revenue_Trend' type-v2='widget' w='49000' x='1000' y='1000' />
              <zone h='49000' id='8' name='Regional_Sales_Distribution' type-v2='widget' w='49000' x='1000' y='50000' />
            </zone>
            <zone h='98000' id='9' param='vert' type-v2='layout-flow' w='49000' x='50000' y='1000'>
              <zone h='49000' id='10' name='Category_Performance' type-v2='widget' w='49000' x='50000' y='1000' />
              <zone h='49000' id='11' name='Top_Customer_Spenders' type-v2='widget' w='49000' x='50000' y='50000' />
            </zone>
          </zone>
        </zone>
      </zones>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC05}' />
    </dashboard>
  </dashboards>

  <windows source-height='30'>
    <window class='dashboard' maximized='true' name='Retail_Sales_Executive_Dashboard'>
      <viewpoints />
      <active id='-1' />
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC06}' />
    </window>
    <window class='worksheet' name='Monthly_Revenue_Trend'>
      <cards>
        <edge name='left'>
          <strip size='160'>
            <card type='pages' />
            <card type='filters' />
            <card type='marks' />
          </strip>
        </edge>
        <edge name='top'>
          <strip size='2147483647'>
            <card type='columns' />
          </strip>
          <strip size='2147483647'>
            <card type='rows' />
          </strip>
        </edge>
      </cards>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC07}' />
    </window>
    <window class='worksheet' name='Category_Performance'>
      <cards>
        <edge name='left'>
          <strip size='160'>
            <card type='pages' />
            <card type='filters' />
            <card type='marks' />
          </strip>
        </edge>
        <edge name='top'>
          <strip size='2147483647'>
            <card type='columns' />
          </strip>
          <strip size='2147483647'>
            <card type='rows' />
          </strip>
        </edge>
      </cards>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC08}' />
    </window>
    <window class='worksheet' name='Regional_Sales_Distribution'>
      <cards>
        <edge name='left'>
          <strip size='160'>
            <card type='pages' />
            <card type='filters' />
            <card type='marks' />
          </strip>
        </edge>
        <edge name='top'>
          <strip size='2147483647'>
            <card type='columns' />
          </strip>
          <strip size='2147483647'>
            <card type='rows' />
          </strip>
        </edge>
      </cards>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC09}' />
    </window>
    <window class='worksheet' name='Top_Customer_Spenders'>
      <cards>
        <edge name='left'>
          <strip size='160'>
            <card type='pages' />
            <card type='filters' />
            <card type='marks' />
          </strip>
        </edge>
        <edge name='top'>
          <strip size='2147483647'>
            <card type='columns' />
          </strip>
          <strip size='2147483647'>
            <card type='rows' />
          </strip>
        </edge>
      </cards>
      <simple-id uuid='{F1A1B2C3-D4E5-4678-9012-3456789ABC10}' />
    </window>
  </windows>
</workbook>
"""
    # Write .twb
    twb_path = "03_Tableau/retail_sales_dashboard.twb"
    with open(twb_path, "w", encoding="utf-8") as f:
        f.write(twb_content)
    print(f"Generated {twb_path} ({os.path.getsize(twb_path)} bytes)")

    # Build .twbx (Packaged Tableau Workbook: Zip containing .twb and Data/tableau_sales_master.csv)
    twbx_path = "03_Tableau/retail_sales_dashboard.twbx"
    with zipfile.ZipFile(twbx_path, "w", zipfile.ZIP_DEFLATED) as zf:
        # Include twb at root
        zf.write(twb_path, arcname="retail_sales_dashboard.twb")
        # Include csv inside Data directory
        csv_path = "03_Tableau/tableau_sales_master.csv"
        zf.write(csv_path, arcname="Data/tableau_sales_master.csv")
        zf.write(csv_path, arcname="tableau_sales_master.csv")
    print(f"Generated {twbx_path} ({os.path.getsize(twbx_path)} bytes)")

if __name__ == "__main__":
    generate_tableau_workbook()
