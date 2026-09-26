// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'topup_package_option.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const TopupPackageOptionProviderEnum _$topupPackageOptionProviderEnum_manual =
    const TopupPackageOptionProviderEnum._('manual');
const TopupPackageOptionProviderEnum _$topupPackageOptionProviderEnum_doku =
    const TopupPackageOptionProviderEnum._('doku');

TopupPackageOptionProviderEnum _$topupPackageOptionProviderEnumValueOf(
    String name) {
  switch (name) {
    case 'manual':
      return _$topupPackageOptionProviderEnum_manual;
    case 'doku':
      return _$topupPackageOptionProviderEnum_doku;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<TopupPackageOptionProviderEnum>
    _$topupPackageOptionProviderEnumValues = BuiltSet<
        TopupPackageOptionProviderEnum>(const <TopupPackageOptionProviderEnum>[
  _$topupPackageOptionProviderEnum_manual,
  _$topupPackageOptionProviderEnum_doku,
]);

Serializer<TopupPackageOptionProviderEnum>
    _$topupPackageOptionProviderEnumSerializer =
    _$TopupPackageOptionProviderEnumSerializer();

class _$TopupPackageOptionProviderEnumSerializer
    implements PrimitiveSerializer<TopupPackageOptionProviderEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'manual': 'manual',
    'doku': 'doku',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'manual': 'manual',
    'doku': 'doku',
  };

  @override
  final Iterable<Type> types = const <Type>[TopupPackageOptionProviderEnum];
  @override
  final String wireName = 'TopupPackageOptionProviderEnum';

  @override
  Object serialize(
          Serializers serializers, TopupPackageOptionProviderEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  TopupPackageOptionProviderEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      TopupPackageOptionProviderEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$TopupPackageOption extends TopupPackageOption {
  @override
  final int amountRupiah;
  @override
  final int credits;
  @override
  final TopupPackageOptionProviderEnum provider;

  factory _$TopupPackageOption(
          [void Function(TopupPackageOptionBuilder)? updates]) =>
      (TopupPackageOptionBuilder()..update(updates))._build();

  _$TopupPackageOption._(
      {required this.amountRupiah,
      required this.credits,
      required this.provider})
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
        provider == other.provider;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, credits.hashCode);
    _$hash = $jc(_$hash, provider.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'TopupPackageOption')
          ..add('amountRupiah', amountRupiah)
          ..add('credits', credits)
          ..add('provider', provider))
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

  TopupPackageOptionProviderEnum? _provider;
  TopupPackageOptionProviderEnum? get provider => _$this._provider;
  set provider(TopupPackageOptionProviderEnum? provider) =>
      _$this._provider = provider;

  TopupPackageOptionBuilder() {
    TopupPackageOption._defaults(this);
  }

  TopupPackageOptionBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _credits = $v.credits;
      _provider = $v.provider;
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
    final _$result = _$v ??
        _$TopupPackageOption._(
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'TopupPackageOption', 'amountRupiah'),
          credits: BuiltValueNullFieldError.checkNotNull(
              credits, r'TopupPackageOption', 'credits'),
          provider: BuiltValueNullFieldError.checkNotNull(
              provider, r'TopupPackageOption', 'provider'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
