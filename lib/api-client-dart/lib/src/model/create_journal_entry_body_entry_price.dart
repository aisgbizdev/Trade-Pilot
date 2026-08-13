//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'dart:core';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';
import 'package:one_of/one_of.dart';

part 'create_journal_entry_body_entry_price.g.dart';

/// CreateJournalEntryBodyEntryPrice
@BuiltValue()
abstract class CreateJournalEntryBodyEntryPrice implements Built<CreateJournalEntryBodyEntryPrice, CreateJournalEntryBodyEntryPriceBuilder> {
  /// One Of [String], [num]
  OneOf get oneOf;

  CreateJournalEntryBodyEntryPrice._();

  factory CreateJournalEntryBodyEntryPrice([void updates(CreateJournalEntryBodyEntryPriceBuilder b)]) = _$CreateJournalEntryBodyEntryPrice;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateJournalEntryBodyEntryPriceBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateJournalEntryBodyEntryPrice> get serializer => _$CreateJournalEntryBodyEntryPriceSerializer();
}

class _$CreateJournalEntryBodyEntryPriceSerializer implements PrimitiveSerializer<CreateJournalEntryBodyEntryPrice> {
  @override
  final Iterable<Type> types = const [CreateJournalEntryBodyEntryPrice, _$CreateJournalEntryBodyEntryPrice];

  @override
  final String wireName = r'CreateJournalEntryBodyEntryPrice';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateJournalEntryBodyEntryPrice object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateJournalEntryBodyEntryPrice object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final oneOf = object.oneOf;
    return serializers.serialize(oneOf.value, specifiedType: FullType(oneOf.valueType))!;
  }

  @override
  CreateJournalEntryBodyEntryPrice deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateJournalEntryBodyEntryPriceBuilder();
    Object? oneOfDataSrc;
    final targetType = const FullType(OneOf, [FullType(String), FullType(num), ]);
    oneOfDataSrc = serialized;
    result.oneOf = serializers.deserialize(oneOfDataSrc, specifiedType: targetType) as OneOf;
    return result.build();
  }
}

