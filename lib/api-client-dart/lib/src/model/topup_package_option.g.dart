// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_package_option.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const TopupPackageOptionDokuMethodsEnum _$topupPackageOptionDokuMethodsEnum_va =
    const TopupPackageOptionDokuMethodsEnum._('va');
const TopupPackageOptionDokuMethodsEnum
    _$topupPackageOptionDokuMethodsEnum_qris =
    const TopupPackageOptionDokuMethodsEnum._('qris');

TopupPackageOptionDokuMethodsEnum _$topupPackageOptionDokuMethodsEnumValueOf(
    String name) {
  switch (name) {
    case 'va':
      return _$topupPackageOptionDokuMethodsEnum_va;
    case 'qris':
      return _$topupPackageOptionDokuMethodsEnum_qris;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<TopupPackageOptionDokuMethodsEnum>
    _$topupPackageOptionDokuMethodsEnumValues = BuiltSet<
        TopupPackageOptionDokuMethodsEnum>(const <TopupPackageOptionDokuMethodsEnum>[
  _$topupPackageOptionDokuMethodsEnum_va,
  _$topupPackageOptionDokuMethodsEnum_qris,
]);

Serializer<TopupPackageOptionDokuMethodsEnum>
    _$topupPackageOptionDokuMethodsEnumSerializer =
    _$TopupPackageOptionDokuMethodsEnumSerializer();

class _$TopupPackageOptionDokuMethodsEnumSerializer
    implements PrimitiveSerializer<TopupPackageOptionDokuMethodsEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'va': 'va',
    'qris': 'qris',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'va': 'va',
    'qris': 'qris',
  };

  @override
  final Iterable<Type> types = const <Type>[TopupPackageOptionDokuMethodsEnum];
  @override
  final String wireName = 'TopupPackageOptionDokuMethodsEnum';

  @override
  Object serialize(
          Serializers serializers, TopupPackageOptionDokuMethodsEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  TopupPackageOptionDokuMethodsEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      TopupPackageOptionDokuMethodsEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$TopupPackageOption extends TopupPackageOption {
  @override
  final int amountRupiah;
  @override
  final int credits;
  @override
  final BuiltList<TopupPackageOptionDokuMethodsEnum> dokuMethods;
  @override
  final int adminFeeRupiah;

  factory _$TopupPackageOption(
          [void Function(TopupPackageOptionBuilder)? updates]) =>
      (TopupPackageOptionBuilder()..update(updates))._build();

  _$TopupPackageOption._(
      {required this.amountRupiah,
      required this.credits,
      required this.dokuMethods,
      required this.adminFeeRupiah})
      : super._();
  @override
  TopupPackageOption rebuild(
          void Function(TopupPackageOptionBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  TopupPackageOptionBuilder toBuilder() =>
      TopupPackageOptionBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is TopupPackageOption &&
        amountRupiah == other.amountRupiah &&
        credits == other.credits &&
        dokuMethods == other.dokuMethods &&
        adminFeeRupiah == other.adminFeeRupiah;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, credits.hashCode);
    _$hash = $jc(_$hash, dokuMethods.hashCode);
    _$hash = $jc(_$hash, adminFeeRupiah.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupPackageOption')
          ..add('amountRupiah', amountRupiah)
          ..add('credits', credits)
          ..add('dokuMethods', dokuMethods)
          ..add('adminFeeRupiah', adminFeeRupiah))
        .toString();
  }
}

class TopupPackageOptionBuilder
    implements Builder<TopupPackageOption, TopupPackageOptionBuilder> {
  _$TopupPackageOption? _$v;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(int? amountRupiah) => _$this._amountRupiah = amountRupiah;

  int? _credits;
  int? get credits => _$this._credits;
  set credits(int? credits) => _$this._credits = credits;

  ListBuilder<TopupPackageOptionDokuMethodsEnum>? _dokuMethods;
  ListBuilder<TopupPackageOptionDokuMethodsEnum> get dokuMethods =>
      _$this._dokuMethods ??= ListBuilder<TopupPackageOptionDokuMethodsEnum>();
  set dokuMethods(
          ListBuilder<TopupPackageOptionDokuMethodsEnum>? dokuMethods) =>
      _$this._dokuMethods = dokuMethods;

  int? _adminFeeRupiah;
  int? get adminFeeRupiah => _$this._adminFeeRupiah;
  set adminFeeRupiah(int? adminFeeRupiah) =>
      _$this._adminFeeRupiah = adminFeeRupiah;

  TopupPackageOptionBuilder() {
    TopupPackageOption._defaults(this);
  }

  TopupPackageOptionBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _credits = $v.credits;
      _dokuMethods = $v.dokuMethods.toBuilder();
      _adminFeeRupiah = $v.adminFeeRupiah;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(TopupPackageOption other) {
    _$v = other as _$TopupPackageOption;
  }

  @override
  void update(void Function(TopupPackageOptionBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  TopupPackageOption build() => _build();

  _$TopupPackageOption _build() {
    _$TopupPackageOption _$result;
    try {
      _$result = _$v ??
          _$TopupPackageOption._(
            amountRupiah: BuiltValueNullFieldError.checkNotNull(
                amountRupiah, r'TopupPackageOption', 'amountRupiah'),
            credits: BuiltValueNullFieldError.checkNotNull(
                credits, r'TopupPackageOption', 'credits'),
            dokuMethods: dokuMethods.build(),
            adminFeeRupiah: BuiltValueNullFieldError.checkNotNull(
                adminFeeRupiah, r'TopupPackageOption', 'adminFeeRupiah'),
          );
    } catch (_) {
      late String _$failedField;
      try {
        _$failedField = 'dokuMethods';
        dokuMethods.build();
      } catch (e) {
        throw BuiltValueNestedFieldError(
            r'TopupPackageOption', _$failedField, e.toString());
      }
      rethrow;
    }
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
