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

const CreateDokuCheckoutBodySource_Enum _$createDokuCheckoutBodySourceEnum_app =
    const CreateDokuCheckoutBodySource_Enum._('app');

CreateDokuCheckoutBodySource_Enum _$createDokuCheckoutBodySourceEnumValueOf(
    String name) {
  switch (name) {
    case 'app':
      return _$createDokuCheckoutBodySourceEnum_app;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateDokuCheckoutBodySource_Enum>
    _$createDokuCheckoutBodySourceEnumValues = BuiltSet<
        CreateDokuCheckoutBodySource_Enum>(const <CreateDokuCheckoutBodySource_Enum>[
  _$createDokuCheckoutBodySourceEnum_app,
]);

Serializer<CreateDokuCheckoutBodyMethodEnum>
    _$createDokuCheckoutBodyMethodEnumSerializer =
    _$CreateDokuCheckoutBodyMethodEnumSerializer();
Serializer<CreateDokuCheckoutBodySource_Enum>
    _$createDokuCheckoutBodySourceEnumSerializer =
    _$CreateDokuCheckoutBodySource_EnumSerializer();

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

class _$CreateDokuCheckoutBodySource_EnumSerializer
    implements PrimitiveSerializer<CreateDokuCheckoutBodySource_Enum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'app': 'app',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'app': 'app',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateDokuCheckoutBodySource_Enum];
  @override
  final String wireName = 'CreateDokuCheckoutBodySource_Enum';

  @override
  Object serialize(
          Serializers serializers, CreateDokuCheckoutBodySource_Enum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateDokuCheckoutBodySource_Enum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateDokuCheckoutBodySource_Enum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateDokuCheckoutBody extends CreateDokuCheckoutBody {
  @override
  final int amountRupiah;
  @override
  final CreateDokuCheckoutBodyMethodEnum method;
  @override
  final CreateDokuCheckoutBodySource_Enum? source_;

  factory _$CreateDokuCheckoutBody(
          [void Function(CreateDokuCheckoutBodyBuilder)? updates]) =>
      (CreateDokuCheckoutBodyBuilder()..update(updates))._build();

  _$CreateDokuCheckoutBody._(
      {required this.amountRupiah, required this.method, this.source_})
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
        method == other.method &&
        source_ == other.source_;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, amountRupiah.hashCode);
    _$hash = $jc(_$hash, method.hashCode);
    _$hash = $jc(_$hash, source_.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateDokuCheckoutBody')
          ..add('amountRupiah', amountRupiah)
          ..add('method', method)
          ..add('source_', source_))
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

  CreateDokuCheckoutBodySource_Enum? _source_;
  CreateDokuCheckoutBodySource_Enum? get source_ => _$this._source_;
  set source_(CreateDokuCheckoutBodySource_Enum? source_) =>
      _$this._source_ = source_;

  CreateDokuCheckoutBodyBuilder() {
    CreateDokuCheckoutBody._defaults(this);
  }

  CreateDokuCheckoutBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _amountRupiah = $v.amountRupiah;
      _method = $v.method;
      _source_ = $v.source_;
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
          source_: source_,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
