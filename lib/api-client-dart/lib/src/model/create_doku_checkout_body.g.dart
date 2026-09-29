// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_doku_checkout_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateDokuCheckoutBodyMethodEnum _$createDokuCheckoutBodyMethodEnum_va =
    const CreateDokuCheckoutBodyMethodEnum._('va');
const CreateDokuCheckoutBodyMethodEnum _$createDokuCheckoutBodyMethodEnum_qris =
    const CreateDokuCheckoutBodyMethodEnum._('qris');

CreateDokuCheckoutBodyMethodEnum _$createDokuCheckoutBodyMethodEnumValueOf(
    String name) {
  switch (name) {
    case 'va':
      return _$createDokuCheckoutBodyMethodEnum_va;
    case 'qris':
      return _$createDokuCheckoutBodyMethodEnum_qris;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateDokuCheckoutBodyMethodEnum>
    _$createDokuCheckoutBodyMethodEnumValues = BuiltSet<
        CreateDokuCheckoutBodyMethodEnum>(const <CreateDokuCheckoutBodyMethodEnum>[
  _$createDokuCheckoutBodyMethodEnum_va,
  _$createDokuCheckoutBodyMethodEnum_qris,
]);

Serializer<CreateDokuCheckoutBodyMethodEnum>
    _$createDokuCheckoutBodyMethodEnumSerializer =
    _$CreateDokuCheckoutBodyMethodEnumSerializer();

class _$CreateDokuCheckoutBodyMethodEnumSerializer
    implements PrimitiveSerializer<CreateDokuCheckoutBodyMethodEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'va': 'va',
    'qris': 'qris',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'va': 'va',
    'qris': 'qris',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateDokuCheckoutBodyMethodEnum];
  @override
  final String wireName = 'CreateDokuCheckoutBodyMethodEnum';

  @override
  Object serialize(
          Serializers serializers, CreateDokuCheckoutBodyMethodEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateDokuCheckoutBodyMethodEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateDokuCheckoutBodyMethodEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateDokuCheckoutBody extends CreateDokuCheckoutBody {
  @override
  final int amountRupiah;
  @override
  final CreateDokuCheckoutBodyMethodEnum method;

  factory _$CreateDokuCheckoutBody(
          [void Function(CreateDokuCheckoutBodyBuilder)? updates]) =>
      (CreateDokuCheckoutBodyBuilder()..update(updates))._build();

  _$CreateDokuCheckoutBody._({required this.amountRupiah, required this.method})
      : super._();
  @override
  CreateDokuCheckoutBody rebuild(
          void Function(CreateDokuCheckoutBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateDokuCheckoutBodyBuilder toBuilder() =>
      CreateDokuCheckoutBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateDokuCheckoutBody &&
        amountRupiah == other.amountRupiah &&
        method == other.method;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, method.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateDokuCheckoutBody')
          ..add('amountRupiah', amountRupiah)
          ..add('method', method))
        .toString();
  }
}

class CreateDokuCheckoutBodyBuilder
    implements Builder<CreateDokuCheckoutBody, CreateDokuCheckoutBodyBuilder> {
  _$CreateDokuCheckoutBody? _$v;

  int? _amountRupiah;
  int? get amountRupiah => _$this._amountRupiah;
  set amountRupiah(int? amountRupiah) => _$this._amountRupiah = amountRupiah;

  CreateDokuCheckoutBodyMethodEnum? _method;
  CreateDokuCheckoutBodyMethodEnum? get method => _$this._method;
  set method(CreateDokuCheckoutBodyMethodEnum? method) =>
      _$this._method = method;

  CreateDokuCheckoutBodyBuilder() {
    CreateDokuCheckoutBody._defaults(this);
  }

  CreateDokuCheckoutBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _method = $v.method;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateDokuCheckoutBody other) {
    _$v = other as _$CreateDokuCheckoutBody;
  }

  @override
  void update(void Function(CreateDokuCheckoutBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateDokuCheckoutBody build() => _build();

  _$CreateDokuCheckoutBody _build() {
    final _$result = _$v ??
        _$CreateDokuCheckoutBody._(
          amountRupiah: BuiltValueNullFieldError.checkNotNull(
              amountRupiah, r'CreateDokuCheckoutBody', 'amountRupiah'),
          method: BuiltValueNullFieldError.checkNotNull(
              method, r'CreateDokuCheckoutBody', 'method'),
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
