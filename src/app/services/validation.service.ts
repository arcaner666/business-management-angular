import { Injectable } from '@angular/core';

import { AccountExtDto } from 'src/app/models/dtos/account-ext-dto';
import { AccountExtDtoErrors } from 'src/app/models/validation-errors/account-ext-dto-errors';
import { ApartmentExtDto } from 'src/app/models/dtos/apartment-ext-dto';
import { ApartmentExtDtoErrors } from 'src/app/models/validation-errors/apartment-ext-dto-errors';
import { BranchExtDto } from 'src/app/models/dtos/branch-ext-dto';
import { BranchExtDtoErrors } from 'src/app/models/validation-errors/branch-ext-dto-errors';
import { EmployeeExtDto } from 'src/app/models/dtos/employee-ext-dto';
import { EmployeeExtDtoErrors } from 'src/app/models/validation-errors/employee-ext-dto-errors';
import { FlatExtDto } from 'src/app/models/dtos/flat-ext-dto';
import { FlatExtDtoErrors } from 'src/app/models/validation-errors/flat-ext-dto-errors';
import { HouseOwnerExtDto } from 'src/app/models/dtos/house-owner-ext-dto';
import { HouseOwnerExtDtoErrors } from 'src/app/models/validation-errors/house-owner-ext-dto-errors';
import { SectionExtDto } from 'src/app/models/dtos/section-ext-dto';
import { SectionExtDtoErrors } from 'src/app/models/validation-errors/section-ext-dto-errors';
import { SectionGroupDto } from 'src/app/models/dtos/section-group-dto';
import { SectionGroupDtoErrors } from 'src/app/models/validation-errors/section-group-dto-errors';
import { TenantExtDto } from 'src/app/models/dtos/tenant-ext-dto';
import { TenantExtDtoErrors } from 'src/app/models/validation-errors/tenant-ext-dto-errors';

import { AccountExtService } from 'src/app/services/account-ext.service';
import { ApartmentExtService } from 'src/app/services/apartment-ext.service';
import { BranchExtService } from 'src/app/services/branch-ext.service';
import { EmployeeExtService } from 'src/app/services/employee-ext.service';
import { FlatExtService } from 'src/app/services/flat-ext.service';
import { HouseOwnerExtService } from 'src/app/services/house-owner-ext.service';
import { SectionExtService } from 'src/app/services/section-ext.service';
import { SectionGroupService } from 'src/app/services/section-group.service';
import { TenantExtService } from 'src/app/services/tenant-ext.service';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(
    private accountExtService: AccountExtService,
    private apartmentExtService: ApartmentExtService,
    private branchExtService: BranchExtService,
    private employeeExtService: EmployeeExtService,
    private flatExtService: FlatExtService,
    private houseOwnerExtService: HouseOwnerExtService,
    private sectionExtService: SectionExtService,
    private sectionGroupService: SectionGroupService,
    private tenantExtService: TenantExtService,
  ) {
  }

  // Validasyon başarılıysa true, başarısız olursa false dönmeli.

  // Validasyon Tipleri
  number(value: number | undefined | null): boolean {
    return (value == undefined || value == null || value <= 0 ? false : true);
  }

  numberPreciseLength(value: number | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.toString().length != length ? false : true);
  }

  string(value: string | undefined | null): boolean {
    return (value == undefined || value == null || value == "" ? false : true);
  }

  stringPreciseLength(value: string | undefined | null, length: number): boolean {
    return (value == undefined || value == null || value.length != length ? false : true);
  }

  date(value: Date | undefined | null): boolean {
    return (value == undefined || value == null ? false : true);
  }
 
  dateInPast(value: Date | undefined | null): boolean {
    return (value == undefined || value == null || new Date(value).valueOf() > Date.now().valueOf() ? false : true);
  }

  // Kurallar
  validateAccountExtDto(accountExtDto: AccountExtDto, validationType: string): [boolean, AccountExtDtoErrors] {
    let accountExtDtoErrors = this.accountExtService.emptyAccountExtDtoErrors;  
    let isValid: boolean = true;

    const accountGroupId: boolean = this.number(accountExtDto.accountGroupId);
    if (!accountGroupId && validationType == "add" || 
    !accountGroupId && validationType == "code")
      accountExtDtoErrors.accountGroupId = "Lütfen hesap grubu seçiniz.";
      
    const branchId: boolean = this.number(accountExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      accountExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(accountExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      accountExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(accountExtDto.accountCode);
    if (!accountCode && validationType == "add")
      accountExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";

    const limit: boolean = this.number(accountExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      accountExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";

    for (const key in accountExtDtoErrors) {
      if (accountExtDtoErrors[key as keyof AccountExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, accountExtDtoErrors];
  }

  validateApartmentExtDto(apartmentExtDto: ApartmentExtDto, validationType: string): [boolean, ApartmentExtDtoErrors] {
    let apartmentExtDtoErrors = this.apartmentExtService.emptyApartmentExtDtoErrors;  
    let isValid: boolean = true;

    const sectionId: boolean = this.number(apartmentExtDto.sectionId);
    if (!sectionId && validationType == "add")
      apartmentExtDtoErrors.sectionId = "Lütfen site seçiniz.";

    const managerId: boolean = this.number(apartmentExtDto.managerId);
    if (!managerId && validationType == "add" || 
    !managerId && validationType == "update")
      apartmentExtDtoErrors.managerId = "Lütfen yönetici seçiniz.";
      
    const apartmentName: boolean = this.string(apartmentExtDto.apartmentName);
    if (!apartmentName && validationType == "add" || 
    !apartmentName && validationType == "update")
      apartmentExtDtoErrors.apartmentName = "Lütfen apartman adı giriniz.";

    const blockNumber: boolean = this.number(apartmentExtDto.blockNumber);
    if (!blockNumber && validationType == "add" || 
    !blockNumber && validationType == "update")
      apartmentExtDtoErrors.blockNumber = "Lütfen blok numarası giriniz.";

    for (const key in apartmentExtDtoErrors) {
      if (apartmentExtDtoErrors[key as keyof ApartmentExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, apartmentExtDtoErrors];
  }

  validateBranchExtDto(branchExtDto: BranchExtDto, validationType: string): [boolean, BranchExtDtoErrors] {
    let branchExtDtoErrors = this.branchExtService.emptyBranchExtDtoErrors;  
    let isValid: boolean = true;

    const branchName: boolean = this.string(branchExtDto.branchName);
    if (!branchName && validationType == "add" || 
    !branchName && validationType == "update")
      branchExtDtoErrors.branchName = "Lütfen şube adı giriniz.";

    const branchCode: boolean = this.string(branchExtDto.branchCode);
    if (!branchCode && validationType == "add")
      branchExtDtoErrors.branchCode = "Lütfen şube kodu oluşturunuz.";
      
    const cityId: boolean = this.number(branchExtDto.cityId);
    if (!cityId && validationType == "add" || 
    !cityId && validationType == "update")
      branchExtDtoErrors.cityId = "Lütfen şehir seçiniz.";

    const districtId: boolean = this.number(branchExtDto.districtId);
    if (!districtId && validationType == "add" || 
    !districtId && validationType == "update")
      branchExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";

    const addressTitle: boolean = this.string(branchExtDto.addressTitle);
    if (!addressTitle && validationType == "add" || 
    !addressTitle && validationType == "update")
      branchExtDtoErrors.addressTitle = "Lütfen adres başlığı giriniz.";
    
    const postalCode: boolean = this.number(branchExtDto.postalCode);
    if (!postalCode && validationType == "add" || 
    !postalCode && validationType == "update")
      branchExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";

    const addressText: boolean = this.string(branchExtDto.addressText);
    if (!addressText && validationType == "add" || 
    !addressText && validationType == "update")
      branchExtDtoErrors.addressText = "Lütfen adres giriniz.";

    for (const key in branchExtDtoErrors) {
      if (branchExtDtoErrors[key as keyof BranchExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, branchExtDtoErrors];
  }

  validateEmployeeExtDto(employeeExtDto: EmployeeExtDto, validationType: string): [boolean, EmployeeExtDtoErrors] {
    let employeeExtDtoErrors = this.employeeExtService.emptyEmployeeExtDtoErrors;  
    let isValid: boolean = true;

    const nameSurname: boolean = this.string(employeeExtDto.nameSurname);
    if (!nameSurname && validationType == "add" || 
    !nameSurname && validationType == "update")
      employeeExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";

    const phone1: boolean = this.string(employeeExtDto.phone);
    if (!phone1 && validationType == "add")
      employeeExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const phone2: boolean = this.stringPreciseLength(employeeExtDto.phone, 10);
    if (!phone2 && validationType == "add")
      employeeExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
    
    const employeeTypeId: boolean = this.number(employeeExtDto.employeeTypeId);
    if (!employeeTypeId && validationType == "add" || 
    !employeeTypeId && validationType == "update")
      employeeExtDtoErrors.employeeTypeId = "Lütfen personel tipi seçiniz.";
    
    const startDate1: boolean = this.date(employeeExtDto.startDate);
    if (!startDate1 && validationType == "update")
      employeeExtDtoErrors.startDate = "Lütfen işe başlama tarihini seçiniz.";

    const startDate2: boolean = this.dateInPast(employeeExtDto.startDate);
    if (!startDate2 && validationType == "update")
      employeeExtDtoErrors.startDate = "İşe başlama tarihi alanına geçmiş bir tarih girilmelidir.";

    const branchId: boolean = this.number(employeeExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      employeeExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(employeeExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      employeeExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(employeeExtDto.accountCode);
    if (!accountCode && validationType == "add")
      employeeExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";

    const identityNumber1: boolean = this.number(employeeExtDto.identityNumber);
    if (!identityNumber1 && validationType == "add" || 
    !identityNumber1 && validationType == "update" )
      employeeExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";

    const identityNumber2: boolean = this.numberPreciseLength(employeeExtDto.identityNumber, 11);
    if (!identityNumber2 && validationType == "add" || 
    !identityNumber2 && validationType == "update")
      employeeExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";

    const limit: boolean = this.number(employeeExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      employeeExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";

    for (const key in employeeExtDtoErrors) {
      if (employeeExtDtoErrors[key as keyof EmployeeExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, employeeExtDtoErrors];
  }

  validateFlatExtDto(flatExtDto: FlatExtDto, validationType: string): [boolean, FlatExtDtoErrors] {
    let flatExtDtoErrors = this.flatExtService.emptyFlatExtDtoErrors;  
    let isValid: boolean = true;

    const sectionId: boolean = this.number(flatExtDto.sectionId);
    if (!sectionId && validationType == "add")
      flatExtDtoErrors.sectionId = "Lütfen site seçiniz.";

    const apartmentId: boolean = this.number(flatExtDto.apartmentId);
    if (!apartmentId && validationType == "add")
      flatExtDtoErrors.apartmentId = "Lütfen apartman seçiniz.";

    const doorNumber: boolean = this.number(flatExtDto.doorNumber);
    if (!doorNumber && validationType == "add" || 
    !doorNumber && validationType == "update")
      flatExtDtoErrors.doorNumber = "Lütfen kapı numarası giriniz.";

    for (const key in flatExtDtoErrors) {
      if (flatExtDtoErrors[key as keyof FlatExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, flatExtDtoErrors];
  }

  validateHouseOwnerExtDto(houseOwnerExtDto: HouseOwnerExtDto, validationType: string): [boolean, HouseOwnerExtDtoErrors] {
    let houseOwnerExtDtoErrors = this.houseOwnerExtService.emptyHouseOwnerExtDtoErrors;  
    let isValid: boolean = true;

    const nameSurname: boolean = this.string(houseOwnerExtDto.nameSurname);
    if (!nameSurname && validationType == "add" || 
    !nameSurname && validationType == "update")
      houseOwnerExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";

    const phone1: boolean = this.string(houseOwnerExtDto.phone);
    if (!phone1 && validationType == "add")
      houseOwnerExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const phone2: boolean = this.stringPreciseLength(houseOwnerExtDto.phone, 10);
    if (!phone2 && validationType == "add")
      houseOwnerExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
    
    const branchId: boolean = this.number(houseOwnerExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      houseOwnerExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(houseOwnerExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      houseOwnerExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(houseOwnerExtDto.accountCode);
    if (!accountCode && validationType == "add")
      houseOwnerExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";
    
    const taxOffice: boolean = this.string(houseOwnerExtDto.taxOffice);
    if (!taxOffice && validationType == "add" || 
    !taxOffice && validationType == "update")
      houseOwnerExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";

    const taxNumber: boolean = this.number(houseOwnerExtDto.taxNumber);
    if (!taxNumber && validationType == "add" || 
    !taxNumber && validationType == "update")
      houseOwnerExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";

    const identityNumber1: boolean = this.number(houseOwnerExtDto.identityNumber);
    if (!identityNumber1 && validationType == "add" || 
    !identityNumber1 && validationType == "update" )
      houseOwnerExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";

    const identityNumber2: boolean = this.numberPreciseLength(houseOwnerExtDto.identityNumber, 11);
    if (!identityNumber2 && validationType == "add" || 
    !identityNumber2 && validationType == "update")
      houseOwnerExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";

    const limit: boolean = this.number(houseOwnerExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      houseOwnerExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
    
    const standartMaturity: boolean = this.number(houseOwnerExtDto.standartMaturity);
    if (!standartMaturity && validationType == "add" || 
    !standartMaturity && validationType == "update")
      houseOwnerExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";

    for (const key in houseOwnerExtDtoErrors) {
      if (houseOwnerExtDtoErrors[key as keyof HouseOwnerExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, houseOwnerExtDtoErrors];
  }

  validateSectionExtDto(sectionExtDto: SectionExtDto, validationType: string): [boolean, SectionExtDtoErrors] {
    let sectionExtDtoErrors = this.sectionExtService.emptySectionExtDtoErrors;  
    let isValid: boolean = true;

    const sectionName: boolean = this.string(sectionExtDto.sectionName);
    if (!sectionName && validationType == "add" || 
    !sectionName && validationType == "update")
      sectionExtDtoErrors.sectionName = "Lütfen site adı giriniz.";

    const sectionGroupId: boolean = this.number(sectionExtDto.sectionGroupId);
    if (!sectionGroupId && validationType == "add" || 
    !sectionGroupId && validationType == "update")
      sectionExtDtoErrors.sectionGroupId = "Lütfen site grubu seçiniz.";
      
    const managerId: boolean = this.number(sectionExtDto.managerId);
    if (!managerId && validationType == "add" || 
    !managerId && validationType == "update")
      sectionExtDtoErrors.managerId = "Lütfen yönetici seçiniz.";

    const cityId: boolean = this.number(sectionExtDto.cityId);
    if (!cityId && validationType == "add" || 
    !cityId && validationType == "update")
      sectionExtDtoErrors.cityId = "Lütfen şehir seçiniz.";

    const districtId: boolean = this.number(sectionExtDto.districtId);
    if (!districtId && validationType == "add" || 
    !districtId && validationType == "update")
      sectionExtDtoErrors.districtId = "Lütfen ilçe seçiniz.";

    const postalCode: boolean = this.number(sectionExtDto.postalCode);
    if (!postalCode && validationType == "add" || 
    !postalCode && validationType == "update")
      sectionExtDtoErrors.postalCode = "Lütfen posta kodu giriniz.";

    const addressText: boolean = this.string(sectionExtDto.addressText);
    if (!addressText && validationType == "add" || 
    !addressText && validationType == "update")
      sectionExtDtoErrors.addressText = "Lütfen adres giriniz.";

    for (const key in sectionExtDtoErrors) {
      if (sectionExtDtoErrors[key as keyof SectionExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, sectionExtDtoErrors];
  }

  validateSectionGroupDto(sectionGroupDto: SectionGroupDto, validationType: string): [boolean, SectionGroupDtoErrors] {
    let sectionGroupDtoErrors = this.sectionGroupService.emptySectionGroupDtoErrors;  
    let isValid: boolean = true;

    const sectionGroupName: boolean = this.string(sectionGroupDto.sectionGroupName);
    if (!sectionGroupName && validationType == "add" || 
    !sectionGroupName && validationType == "update")
      sectionGroupDtoErrors.sectionGroupName = "Lütfen site grubu adı giriniz.";

    for (const key in sectionGroupDtoErrors) {
      if (sectionGroupDtoErrors[key as keyof SectionGroupDtoErrors] != "")
        isValid = false;
    }

    return [isValid, sectionGroupDtoErrors];
  }

  validateTenantExtDto(tenantExtDto: TenantExtDto, validationType: string): [boolean, TenantExtDtoErrors] {
    let tenantExtDtoErrors = this.tenantExtService.emptyTenantExtDtoErrors;  
    let isValid: boolean = true;

    const nameSurname: boolean = this.string(tenantExtDto.nameSurname);
    if (!nameSurname && validationType == "add" || 
    !nameSurname && validationType == "update")
      tenantExtDtoErrors.nameSurname = "Lütfen hesap sahibinin adını ve soyadını giriniz.";

    const phone1: boolean = this.string(tenantExtDto.phone);
    if (!phone1 && validationType == "add")
      tenantExtDtoErrors.phone = "Lütfen telefon numarası giriniz.";

    const phone2: boolean = this.stringPreciseLength(tenantExtDto.phone, 10);
    if (!phone2 && validationType == "add")
      tenantExtDtoErrors.phone = "Telefon numarası 10 haneden oluşmalıdır. Örneğin; 5554443322";
    
    const branchId: boolean = this.number(tenantExtDto.branchId);
    if (!branchId && validationType == "add" || 
    !branchId && validationType == "code")
      tenantExtDtoErrors.branchId = "Lütfen şube seçiniz.";

    const accountName: boolean = this.string(tenantExtDto.accountName);
    if (!accountName && validationType == "add" || 
    !accountName && validationType == "update")
      tenantExtDtoErrors.accountName = "Lütfen hesap adı giriniz.";

    const accountCode: boolean = this.string(tenantExtDto.accountCode);
    if (!accountCode && validationType == "add")
      tenantExtDtoErrors.accountCode = "Lütfen hesap kodu üretiniz.";
    
    const taxOffice: boolean = this.string(tenantExtDto.taxOffice);
    if (!taxOffice && validationType == "add" || 
    !taxOffice && validationType == "update")
      tenantExtDtoErrors.taxOffice = "Lütfen vergi dairesi giriniz.";

    const taxNumber: boolean = this.number(tenantExtDto.taxNumber);
    if (!taxNumber && validationType == "add" || 
    !taxNumber && validationType == "update")
      tenantExtDtoErrors.taxNumber = "Lütfen vergi numarası giriniz.";

    const identityNumber1: boolean = this.number(tenantExtDto.identityNumber);
    if (!identityNumber1 && validationType == "add" || 
    !identityNumber1 && validationType == "update" )
      tenantExtDtoErrors.identityNumber = "Lütfen kimlik numarası giriniz.";

    const identityNumber2: boolean = this.numberPreciseLength(tenantExtDto.identityNumber, 11);
    if (!identityNumber2 && validationType == "add" || 
    !identityNumber2 && validationType == "update")
      tenantExtDtoErrors.identityNumber = "Kimlik numarası 11 haneden oluşmalıdır.";

    const limit: boolean = this.number(tenantExtDto.limit);
    if (!limit && validationType == "add" || 
    !limit && validationType == "update")
      tenantExtDtoErrors.limit = "Lütfen hesap limiti giriniz.";
    
    const standartMaturity: boolean = this.number(tenantExtDto.standartMaturity);
    if (!standartMaturity && validationType == "add" || 
    !standartMaturity && validationType == "update")
      tenantExtDtoErrors.standartMaturity = "Lütfen standart vade giriniz.";

    for (const key in tenantExtDtoErrors) {
      if (tenantExtDtoErrors[key as keyof TenantExtDtoErrors] != "")
        isValid = false;
    }

    return [isValid, tenantExtDtoErrors];
  }
}
